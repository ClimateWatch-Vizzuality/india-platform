import { createStructuredSelector, createSelector } from 'reselect';
import castArray from 'lodash/castArray';
import {
  ALL_SELECTED,
  METRIC_OPTIONS,
  SECTOR_TOTAL
} from 'constants/constants';

import { getMetadata } from './historical-emissions-get-selectors';

const findOption = (
  options,
  value,
  findBy = [ 'name', 'value', 'code', 'label' ]
) =>
  options && options
      .filter(o => o)
      .find(
        o => castArray(findBy).some(key => String(o[key]) === String(value))
      );

// OPTIONS
const METRIC_VALUE_OPTIONS = [
  { value: METRIC_OPTIONS.ABSOLUTE_VALUE, label: 'Absolute value' },
  { value: METRIC_OPTIONS.PER_CAPITA, label: 'Per capita' },
  { value: METRIC_OPTIONS.PER_GDP, label: 'Per GDP' }
];

export const getAllSelectedOption = () => ({
  value: ALL_SELECTED,
  label: 'All Selected',
  override: true
});

const getFieldOptions = field => createSelector([ getMetadata ], metadata => {
  if (field === 'metric') return METRIC_VALUE_OPTIONS;
  if (!metadata || !metadata[field]) return null;

  const options = metadata[field].map(o => {
    const option = { label: o.label, value: String(o.value), code: o.code };
    if (field === 'gas' && o.label === 'All GHG (CO2e)') option.override = true;
    return option;
  });
  return options.filter(o => o);
});

export const getFilterOptions = createStructuredSelector({
  metric: getFieldOptions('metric'),
  sector: getFieldOptions('sector'),
  gas: getFieldOptions('gas')
});

// DEFAULTS
const getDefaults = createSelector([ getFilterOptions, getAllSelectedOption ], (
  options,
  allSelectedOption
) => ({
  metric: findOption(options.metric, METRIC_OPTIONS.ABSOLUTE_VALUE),
  sector: allSelectedOption,
  gas: findOption(options.gas, 'All GHG (CO2e)')
}));

// SELECTED
const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = String(query[field]);
  if (queryValue === ALL_SELECTED) return getAllSelectedOption(state);
  const findSelectedOption = value =>
    findOption(getFilterOptions(state)[field], value);
  return queryValue.includes(',')
    ? queryValue.split(',').map(v => findSelectedOption(v))
    : findSelectedOption(queryValue);
};

const filterSectorSelectedByMetrics = createSelector(
  [
    getFieldSelected('sector'),
    getFieldOptions('sector'),
    getFieldSelected('metric')
  ],
  (sectorSelected, sectorOptions, metric) => {
    if (!sectorOptions || !metric) return null;
    if (!metric.value.endsWith('absolute')) {
      return sectorOptions.find(o => o.code === SECTOR_TOTAL) || sectorSelected;
    }
    return sectorSelected;
  }
);

export const getSelectedOptions = createStructuredSelector({
  metric: getFieldSelected('metric'),
  sector: filterSectorSelectedByMetrics,
  gas: getFieldSelected('gas')
});

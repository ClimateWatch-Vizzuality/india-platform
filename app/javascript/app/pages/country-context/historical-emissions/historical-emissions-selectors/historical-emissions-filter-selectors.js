import { createStructuredSelector, createSelector } from 'reselect';
import castArray from 'lodash/castArray';
import { ALL_SELECTED, SECTOR_TOTAL } from 'constants/constants';

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
export const getAllSelectedOption = () => ({
  value: ALL_SELECTED,
  label: 'All Selected',
  override: true
});

const getFieldOptions = field => createSelector([ getMetadata ], metadata => {
  if (!metadata || !metadata[field]) return null;

  const options = metadata[field].map(o => {
    const option = { label: o.label, value: String(o.value), code: o.code };
    if (field === 'gas' && o.label === 'All GHG (CO2e)') option.override = true;
    return option;
  });
  return options.filter(o => o);
});

export const getFilterOptions = createStructuredSelector({
  sector: getFieldOptions('sector'),
  gas: getFieldOptions('gas')
});

// DEFAULTS
const getDefaults = createSelector([ getFilterOptions, getAllSelectedOption ], (
  options,
  allSelectedOption
) => ({
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

const getSectorSelected = createSelector(
  [ getFieldSelected('sector'), getFieldOptions('sector') ],
  (sectorSelected, sectorOptions) => {
    if (!sectorOptions) return null;
    return sectorOptions.find(o => o.code === SECTOR_TOTAL) || sectorSelected;
  }
);

export const getSelectedOptions = createStructuredSelector({
  sector: getSectorSelected,
  gas: getFieldSelected('gas')
});

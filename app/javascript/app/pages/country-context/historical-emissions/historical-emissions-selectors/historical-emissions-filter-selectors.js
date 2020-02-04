import { createStructuredSelector, createSelector } from 'reselect';
import castArray from 'lodash/castArray';
import { ALL_SELECTED, SECTOR_TOTAL } from 'constants/constants';

import { getMetadata } from './historical-emissions-get-selectors';

const DEFAULT_GAS_OPTION = 'All GHG';
const EXCLUDED_SECTORS = [
  'Total with LULUCF',
  'Total without LULUCF',
  'Fuel Combustion Activities',
  'Fugitive Emission from fuels',
  'Enteric Fermentation',
  'Manure Management',
  'Rice Cultivation',
  'Agricultural Soils',
  'Field burning of Agricultural Residues'
];
const findOption = (
  options,
  value,
  findBy = ['name', 'value', 'code', 'label']
) =>
  options &&
  options
    .filter(o => o)
    .find(o => castArray(findBy).some(key => String(o[key]) === String(value)));

// OPTIONS
export const getAllSelectedOption = () => ({
  value: ALL_SELECTED,
  label: 'All Selected',
  override: true
});

const getFieldOptions = field =>
  createSelector(
    [getMetadata],
    metadata => {
      if (!metadata || !metadata[field]) return null;

      const options = metadata[field]
        .map(({ label, value, code }) => ({
          label,
          value: String(value),
          code
        }))
        .filter(o => o);

      if (field === 'gas') {
        return options.map(option => ({
          ...option,
          override: option.label === DEFAULT_GAS_OPTION
        }));
      }

      return options.filter(({ label }) => !EXCLUDED_SECTORS.includes(label));
    }
  );

export const getFilterOptions = createStructuredSelector({
  sector: getFieldOptions('sector'),
  gas: getFieldOptions('gas')
});

// DEFAULTS
const getDefaults = createSelector(
  [getFilterOptions, getAllSelectedOption],
  (options, allSelectedOption) => ({
    sector: allSelectedOption,
    gas: findOption(options.gas, DEFAULT_GAS_OPTION)
  })
);

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
  [getFieldSelected('sector'), getFieldOptions('sector')],
  (sectorSelected, sectorOptions) => {
    if (!sectorOptions) return null;
    return sectorOptions.find(o => o.code === SECTOR_TOTAL) || sectorSelected;
  }
);

export const getSelectedOptions = createStructuredSelector({
  sector: getSectorSelected,
  gas: getFieldSelected('gas')
});

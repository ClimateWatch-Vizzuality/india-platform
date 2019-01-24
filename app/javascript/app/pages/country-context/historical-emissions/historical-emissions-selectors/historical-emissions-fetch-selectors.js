import isArray from 'lodash/isArray';
import { createSelector } from 'reselect';
import { ALL_SELECTED } from 'constants/constants';
import { getSelectedOptions } from './historical-emissions-filter-selectors';
import { getMetadata } from './historical-emissions-get-selectors';

const { COUNTRY_ISO } = process.env;

const getParam = (fieldName, data) => {
  if (!data) return {};
  if (!isArray(data) && data.value !== ALL_SELECTED)
    return { [fieldName]: data.value };
  if (isArray(data)) return { [fieldName]: data.map(f => f.value).join() };
  return {};
};

export const getEmissionParams = createSelector(
  [ getSelectedOptions, getMetadata ],
  (options, meta) => {
    if (!options || !meta) return null;
    const BURSource = meta.dataSource.find(o => o.label === 'BUR');

    const { gas } = options;
    return {
      location: COUNTRY_ISO,
      source: BURSource.id,
      ...getParam('gas', gas)
    };
  }
);

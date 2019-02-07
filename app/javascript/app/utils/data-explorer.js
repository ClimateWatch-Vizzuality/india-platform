import invertBy from 'lodash/invertBy';
import qs from 'querystring';

import { GLOBAL_CW_PLATFORM } from 'constants/links';

const DATA_EXPLORER_TO_MODULES_PARAMS = {
  'historical-emissions': {
    data_sources: { key: 'source' },
    gwps: { key: 'version' }
  },
  'ndc-sdg-linkages': { goals: { key: 'goal', idLabel: 'number' } },
  'ndc-content': {},
  'emission-pathways': {
    locations: { key: 'currentLocation', idLabel: 'id', currentId: 'iso_code' },
    models: { key: 'model' },
    scenarios: { key: 'scenario' },
    indicators: { key: 'indicator' },
    categories: { key: 'category' },
    subcategories: { key: 'subcategory' }
  }
};

const parseFilters = (search, section) => {
  const modulesToDataExplorerParamsSchema = invertBy(
    DATA_EXPLORER_TO_MODULES_PARAMS[section],
    value => value.key
  );
  const parsedFilters = {};
  Object.keys(search).forEach(key => {
    const parsedKey = `external-${section}-${modulesToDataExplorerParamsSchema[key]}`.replace(
      '_',
      '-'
    );
    parsedFilters[parsedKey] = search[key];
  });
  return parsedFilters;
};

export const generateLinkToDataExplorer = (search, section) => {
  const sectionUrl = section ? `/${section}` : '';
  const params = search
    ? `?${qs.stringify(parseFilters(search, section))}`
    : '';
  return `${GLOBAL_CW_PLATFORM}/data-explorer${sectionUrl}${params}`;
};

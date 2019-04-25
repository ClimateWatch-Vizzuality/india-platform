import { createStructuredSelector, createSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import isArray from 'lodash/isArray';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

import { getThemeConfig, getTooltipConfig } from 'utils/graphs';

import {
  getIndicators,
  getQuery,
  getLoading
} from '../shared/socioeconomic-selectors';

const { COUNTRY_ISO } = process.env;
const ENERGY_INDICATORS = {
  energy_consumption: [
    'energy_consumption',
    'electricity_consumption',
    'energy_consumption_cap'
  ],
  energy_supply: ['installed_capacity', 'energy_intensity']
};

const DEFAULT_INDICATORS = {
  energy_consumption: 'energy_consumption',
  energy_supply: 'installed_capacity'
};

const INDICATOR_QUERY_NAME = 'energyIndicator';
const CATEGORIES_QUERY_NAME = 'categories';

const getSource = createSelector(
  getQuery,
  query =>
    !query || !query.energySource ? 'energy_supply' : query.energySource
);

export const AXES_CONFIG = (yName, yUnit) => ({
  xBottom: { name: 'Year', unit: 'date', format: 'YYYY' },
  yLeft: { name: yName, unit: yUnit, format: 'number' }
});

const getEnergyData = createSelector(
  [getIndicators, getSource],
  (indicators, selectedSource) => {
    if (!indicators) return null;
    return (
      indicators.values &&
      indicators.values.filter(
        ind =>
          ENERGY_INDICATORS[selectedSource].includes(ind.indicator_code) &&
          ind.location_iso_code3 === COUNTRY_ISO
      )
    );
  }
);

const getEnergyIndicator = createSelector(
  [getIndicators, getSource],
  (indicators, selectedSource) => {
    if (!indicators) return null;
    return (
      indicators &&
      indicators.indicators &&
      indicators.indicators.filter(ind =>
        ENERGY_INDICATORS[selectedSource].includes(ind.code))
    );
  }
);

const getOptions = createSelector(
  [getEnergyIndicator],
  energyIndicator => {
    if (!energyIndicator) return null;

    return energyIndicator.map(e => ({ label: e.name, value: e.code }));
  }
);

const getDefaultCategories = createSelector(
  [getEnergyData, getEnergyIndicator, getSource],
  (energyData, energyIndicator, selectedSource) => {
    if (!energyData || !energyIndicator) return null;
    const defaultCategories = {};
    ENERGY_INDICATORS[selectedSource].forEach(selectedIndicator => {
      const data = energyData.filter(
        e => e.indicator_code === selectedIndicator
      );
      defaultCategories[selectedIndicator] = [];
      data.forEach(d =>
        defaultCategories[selectedIndicator].push({
          label:
            d.category ||
            energyIndicator.find(e => e.code === selectedIndicator).name,
          value: d.category || selectedIndicator
        }));
    });

    return defaultCategories;
  }
);

const getFilterOptions = createSelector(
  [getOptions, getDefaultCategories],
  (options, categories) => ({
    [INDICATOR_QUERY_NAME]: options,
    [CATEGORIES_QUERY_NAME]: categories
  })
);

const getDefaults = createSelector(
  [getOptions, getDefaultCategories, getSource],
  (options, defaultCategories, source) =>
    options
      ? {
          [INDICATOR_QUERY_NAME]:
            options &&
            options.find(o => o.value === DEFAULT_INDICATORS[source]),
          [CATEGORIES_QUERY_NAME]: defaultCategories
        }
      : null
);

const findOption = (options, value) =>
  options && options.find(o => o.value === value || o.name === value);

const getFieldSelected = field => state => {
  const { query } = state.location;

  const categoriesField = field === CATEGORIES_QUERY_NAME;
  const categoriesInQuery = query && query[CATEGORIES_QUERY_NAME];
  const indicatorInQuery = query && query[INDICATOR_QUERY_NAME];
  const defaults = getDefaults(state);
  const defaultField = defaults && defaults[field];
  const source = getSource(state);
  const defaultFieldIndicator =
    defaultField && defaultField[DEFAULT_INDICATORS[source]];

  if (categoriesField) {
    if (!query) return defaultFieldIndicator;
    if (indicatorInQuery && !categoriesInQuery) {
      return defaultField && defaultField[query[INDICATOR_QUERY_NAME]];
    }
    if (!categoriesInQuery) return defaultFieldIndicator;
  }
  if (!query || !query[field]) return defaultField;
  const queryValue = query[field];

  const getFilterOptionsForCategories = (s, f) => {
    const filterOptions = getFilterOptions(s)[f];
    if (!filterOptions) return null;
    if (!query[INDICATOR_QUERY_NAME])
      return filterOptions[DEFAULT_INDICATORS[source]];
    return filterOptions[query[INDICATOR_QUERY_NAME]];
  };

  const options = categoriesField
    ? getFilterOptionsForCategories(state, field)
    : getFilterOptions(state)[field];

  const findSelectedOption = value => findOption(options, value);

  return queryValue.includes(',')
    ? queryValue.split(',').map(v => findSelectedOption(v))
    : findSelectedOption(queryValue);
};

const getSelectedOptions = createStructuredSelector({
  [INDICATOR_QUERY_NAME]: getFieldSelected(INDICATOR_QUERY_NAME),
  [CATEGORIES_QUERY_NAME]: getFieldSelected(CATEGORIES_QUERY_NAME)
});

const getYears = createSelector(
  [getEnergyData, getSelectedOptions],
  (energyData, selectedOptions) => {
    if (!energyData || isEmpty(energyData)) return null;
    const valuesCollected = energyData
      .filter(
        e => e.indicator_code === selectedOptions[INDICATOR_QUERY_NAME].value
      )
      .map(ind => ind.values);
    const years = valuesCollected[0].filter(o => o.value).map(o => o.year);
    return years;
  }
);

const getUnit = createSelector(
  [getSelectedOptions, getIndicators],
  (selectedOptions, indicators) => {
    if (
      !selectedOptions ||
      !indicators ||
      !indicators.indicators ||
      isEmpty(indicators.indicators)
    )
      return null;

    const indicator = selectedOptions[INDICATOR_QUERY_NAME];
    return (
      indicators &&
      indicators.indicators &&
      indicators.indicators.find(ind => ind.code === indicator.value).unit
    );
  }
);

const getLegendDataSelected = createSelector(
  [getSelectedOptions, getFilterOptions, getEnergyData],
  (selectedOptions, options, energyData) => {
    if (!selectedOptions || !options || !energyData) return null;
    const dataSelected = selectedOptions[CATEGORIES_QUERY_NAME];
    return isArray(dataSelected) ? dataSelected : [dataSelected];
  }
);

const getYColumnOptions = createSelector(
  [getLegendDataSelected],
  legendDataSelected => {
    if (!legendDataSelected) return null;
    const getYOption = columns =>
      columns.map(d => ({ label: d && d.label, value: d && d.value }));

    return uniqBy(getYOption(legendDataSelected), 'value');
  }
);

const getChartData = createSelector(
  [
    getSelectedOptions,
    getEnergyData,
    getYears,
    getYColumnOptions,
    getLegendDataSelected,
    getUnit,
    getFilterOptions
  ],
  (
    selectedOptions,
    energyData,
    years,
    yColumns,
    legendDataSelected,
    unit,
    filterOptions
  ) => {
    if (
      !selectedOptions ||
      !energyData ||
      !years ||
      !yColumns ||
      !filterOptions
    )
      return null;

    const indicator = selectedOptions[INDICATOR_QUERY_NAME];

    const filteredEnergyDataByIndicator = energyData.filter(
      d => d.indicator_code === indicator.value
    );

    const categories = filteredEnergyDataByIndicator.map(e => ({
      label: e.category || indicator.name,
      value: e.category || indicator.value
    }));
    const selectedData = [];

    if (yColumns && filteredEnergyDataByIndicator && years) {
      years.forEach(year => {
        const dataForYear = { x: parseInt(year, 10) };
        yColumns.forEach(category => {
          const singleCategory = filteredEnergyDataByIndicator.find(
            // if category is null, get indicator_code
            e =>
              (e.category && e.category === category.value) ||
              e.indicator_code === category.value
          );
          if (singleCategory) {
            const categoryForYear = singleCategory.values.find(
              d => d.year === year
            );
            if (categoryForYear) {
              dataForYear[`y${capitalize(category.value)}`] =
                categoryForYear.value;
            } else {
              console.warn(
                `No energy data for ${year} and category ${category.value}`
              );
            }
          }
        });
        selectedData.push(dataForYear);
      });
    }

    const configYColumns = yColumns.map(y => ({
      label: y.label,
      value: `y${capitalize(y.value)}`
    }));

    const allYColumns = filterOptions[CATEGORIES_QUERY_NAME][indicator.value];
    const configAllYColumns = allYColumns.map(y => ({
      label: y.label,
      value: `y${capitalize(y.value)}`
    }));
    return {
      data: selectedData,
      domain: { x: ['auto', 'auto'], y: [0, 'auto'] },
      config: {
        columns: { x: [{ label: 'year', value: 'x' }], y: configYColumns },
        axes: AXES_CONFIG(indicator.label, unit),
        theme: getThemeConfig(configAllYColumns),
        tooltip: getTooltipConfig(configYColumns),
        animation: false,
        yLabelFormat:
          unit === '%' ? value => value : value => format('.2s')(value)
      },
      dataSelected: legendDataSelected,
      dataOptions: categories
    };
  }
);

const getSelectedIndicatorCodes = createSelector(
  [getEnergyIndicator],
  indicators => (indicators && indicators.map(i => i.code)) || []
);

const getSelectedIndicatorValues = createSelector(
  [getSelectedIndicatorCodes, getIndicators],
  (indicatorCodes, indicators) => {
    if (!indicators || !indicators.values || !indicatorCodes) return [];
    return indicators.values.filter(v =>
      indicatorCodes.includes(v.indicator_code));
  }
);

const getSources = createSelector(
  [getSelectedIndicatorValues],
  iValues => uniq(iValues.map(i => i.source))
);

const getDownloadURI = createSelector(
  [getSources, getSelectedIndicatorCodes],
  (sources, indicatorCodes) =>
    `socioeconomic/indicators.zip?code=${indicatorCodes.join(
      ','
    )}&source=${sources.join(',')}`
);

export const getEnergy = createStructuredSelector({
  options: getOptions,
  years: getYears,
  chartData: getChartData,
  selectedOptions: getSelectedOptions,
  query: getQuery,
  loading: getLoading,
  selectedSource: getSource,
  sources: getSources,
  downloadURI: getDownloadURI
});

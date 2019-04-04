import { createStructuredSelector, createSelector } from 'reselect';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { upperCaseLabels } from 'utils/utils';
import {
  getThemeConfig,
  getTooltipConfig,
  setLegendOptions,
  CHART_COLORS
} from 'utils/graphs';
import {
  getQuery,
  getLoading,
  getIndicators,
  getIndicatorsMetadata,
  getNationalIndicators,
  getProvincesIndicators,
  getXColumn,
  getDomain,
  getAxes
} from '../shared/socioeconomic-selectors';

// Total population
const DEFAULT_INDICATOR = {
  CAIT: 'population_3',
  population_by_gender: 'Sex_ratio',
  hdi: 'hdi'
};
const INDICATOR_CODES = {
  CAIT: ['population_3', 'population_4', 'population_5', 'pop_density'],
  population_by_gender: [
    'population_1',
    'population_2',
    'Sex_ratio',
    'Sex_ratio_child'
  ],
  hdi: ['hdi']
};

const DATA_SCALE = 1000;

const MAX_CHART_LEGEND_ELEMENTS = 5;

const formatY = {
  'number of female per 1000 male': value => `${value}`,
  'number of children per 1000 male': value => `${value}`,
  'per square km': value => `${value}`,
  thousand: value => `${format('.2s')(`${value * DATA_SCALE}`)}`,
  million: value => `${format('.2s')(`${value}`).replace('G', 'B')}`,
  '%': value => `${value}%`,
  index: value => `${value}`
};
const getCustomYLabelFormat = unit => formatY[unit];

const getUniqueYears = data => {
  const allYears = flatten(
    data.map(d => d.values).map(arr => arr.map(o => o.year))
  );
  return [...new Set(allYears)];
};

const getYColumn = data => data.map(d => ({ label: d.label, value: d.key }));

const getSelectedIndicatorCodes = createSelector(
  getQuery,
  query => {
    if (!query || !query.populationSource) return INDICATOR_CODES.CAIT;
    return INDICATOR_CODES[query.populationSource];
  }
);

const getSourceIndicatorCode = createSelector(
  getQuery,
  query => (!query || !query.populationSource ? 'CAIT' : query.populationSource)
);

const getDefaultIndicator = createSelector(
  getQuery,
  query => {
    if (!query || !query.populationSource) return DEFAULT_INDICATOR.CAIT;
    return DEFAULT_INDICATOR[query.populationSource];
  }
);

const getSelectedIndicators = createSelector(
  [getNationalIndicators, getSelectedIndicatorCodes],
  (nationalIndicators, selectedIndicatorCodes) => {
    if (!nationalIndicators) return null;
    return selectedIndicatorCodes.map(code =>
      nationalIndicators.find(i => i.indicator_code === code));
  }
);

const getSelectedIndicatorsOptions = createSelector(
  [getIndicatorsMetadata, getSelectedIndicatorCodes],
  (indicatorsMetadata, selectedIndicatorCodes) => {
    if (!indicatorsMetadata) return null;
    return upperCaseLabels(
      sortBy(
        selectedIndicatorCodes.map(code => {
          const meta = indicatorsMetadata.find(i => i.code === code);
          return { label: meta.name, value: meta.code, unit: meta.unit };
        }),
        'label'
      )
    );
  }
);

const getSelectedIndicator = createSelector(
  [getQuery, getSelectedIndicatorsOptions, getDefaultIndicator],
  (query, indicatorsOptions, defaultIndicator) => {
    if (!indicatorsOptions) return null;
    if (!query || !query.popNationalIndicator)
      return indicatorsOptions.find(o => o.value === defaultIndicator);
    return indicatorsOptions.find(o => o.value === query.popNationalIndicator);
  }
);

const getProvincesOptions = createSelector(
  [getProvincesIndicators, getSelectedIndicator],
  (provincesIndicators, selectedIndicator) => {
    if (!provincesIndicators) return null;
    return upperCaseLabels(
      sortBy(
        provincesIndicators
          .filter(i => i.indicator_code === selectedIndicator.value)
          .map(i => ({
            label: i.location,
            value: i.location_iso_code3,
            id: i.location_iso_code3
          })),
        'label'
      )
    );
  }
);

const getSelectedIndicatorsValues = createSelector(
  [getIndicators, getSelectedIndicator],
  (indicators, selectedIndicator) => {
    if (!indicators) return null;
    return (
      indicators.values &&
      indicators.values.filter(
        i => i.indicator_code === selectedIndicator.value
      )
    );
  }
);

const getStatesSelectionOptions = createSelector(
  getSelectedIndicatorsValues,
  selectedIndicatorValues => {
    if (!selectedIndicatorValues) return null;
    return selectedIndicatorValues.map(i => ({
      label: i.location,
      value: i.location_iso_code3
    }));
  }
);

const getSelectedStates = createSelector(
  [getQuery, getStatesSelectionOptions],
  (query, options) => {
    if (!options) return null;
    if (!query || !query.popState) {
      const defaultState = options.find(st => st.value === 'IND') || options[0];
      return [{ value: defaultState.value, label: defaultState.label }];
    }
    const queryArray = query.popState.split(',');
    const statesSelected = queryArray.map(q => {
      const statesData = options.find(o => o.value === q);
      return statesData && { label: statesData.label, value: statesData.value };
    });
    return statesSelected;
  }
);

const getChartRawData = createSelector(
  [getSelectedIndicatorsValues, getSelectedStates],
  (selectedIndicatorValues, selectedStates) => {
    if (!selectedIndicatorValues) return null;
    return selectedStates.map(st => {
      const stateData = selectedIndicatorValues.find(
        i => i.location_iso_code3 === st.value
      );
      return {
        values: stateData.values,
        key: `y${upperFirst(camelCase(stateData.location_iso_code3))}`,
        label: stateData.location,
        id: stateData.location_iso_code3,
        value: stateData.location_iso_code3
      };
    });
  }
);

const getChartXYvalues = createSelector(
  getChartRawData,
  rawData => {
    if (!rawData) return null;
    return getUniqueYears(rawData).map(year => {
      const yValues = {};
      rawData.forEach(({ values, key }) => {
        const valueForYear = values.find(o => o.year === year);
        yValues[key] = (valueForYear && valueForYear.value) || undefined;
      });
      return { x: parseInt(year, 10), ...yValues };
    });
  }
);

const getYAxisUnit = unit => {
  switch (unit) {
    case 'index':
      return {
        unit: 'HDI',
        label: { dx: 28, dy: 24 }
      };
    case 'million':
      return {
        unit: 'People',
        label: { dx: 14, dy: 24 }
      };
    default:
      return {
        unit: upperFirst(unit),
        label: { dx: 14, dy: 10 }
      };
  }
};

const getBarChartData = createSelector(
  [
    getIndicators,
    getSelectedIndicators,
    getProvincesIndicators,
    getSelectedIndicator,
    getChartRawData,
    getChartXYvalues,
    getSelectedStates,
    getStatesSelectionOptions
  ],
  (
    data,
    indicators,
    provincesIndicators,
    selectedIndicator,
    rawData,
    chartXYvalues,
    selectedStates,
    selectionOptions
  ) => {
    if (!indicators || !data || !provincesIndicators) return null;

    const { unit } = selectedIndicator;

    const theme = getThemeConfig(getYColumn(rawData, CHART_COLORS));
    return {
      data: chartXYvalues,
      domain: getDomain(),
      config: {
        axes: getAxes(
          { name: 'Year' },
          {
            name: 'People',
            ...getYAxisUnit(unit)
          }
        ),
        tooltip: {
          ...getTooltipConfig(getYColumn(rawData)),
          x: { label: 'Year' },
          indicator: unit !== 'million' ? upperFirst(unit) : 'People',
          theme,
          formatFunction: formatY[unit]
            ? getCustomYLabelFormat(unit)
            : val => `${format(',.4s')(`${val}`).replace('G', 'B')}`
        },
        animation: false,
        columns: { x: getXColumn(), y: getYColumn(rawData) },
        theme,
        yLabelFormat: getCustomYLabelFormat(unit)
      },
      dataOptions: setLegendOptions(
        selectionOptions,
        selectedStates,
        MAX_CHART_LEGEND_ELEMENTS
      ),
      dataSelected: selectedStates
    };
  }
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

export const getPopulation = createStructuredSelector({
  chartData: getBarChartData,
  query: getQuery,
  nationalIndicatorsOptions: getSelectedIndicatorsOptions,
  popStatesOptions: getProvincesOptions,
  selectedIndicator: getSelectedIndicator,
  selectedSource: getSourceIndicatorCode,
  sources: getSources,
  downloadURI: getDownloadURI,
  loading: getLoading
});

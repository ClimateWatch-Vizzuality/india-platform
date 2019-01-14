import { createStructuredSelector, createSelector } from 'reselect';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import {
  getQuery,
  getIndicators,
  getNationalIndicators,
  getFirstChartFilter,
  getXColumn,
  getTheme,
  getDomain,
  getAxes
} from '../shared/socioeconomic-selectors';

const DEFAULT_STATE = 'Delhi';
// Total population
const DEFAULT_INDICATOR = 'population_3';
const INDICATOR_CODES = {
  CAIT: [
    'population_1',
    'population_2',
    'population_3',
    'population_4',
    'pop_density'
  ],
  age_and_gender: [ 'Sex_ratio', 'Sex_ratio_child' ],
  hdi: [ 'hdi' ]
};
const DATA_SCALE = 1000;

const { COUNTRY_ISO } = process.env;

const getSelectedIndicatorCodes = createSelector(getQuery, query => {
  if (!query || !query.populationSource) return INDICATOR_CODES.CAIT;
  return INDICATOR_CODES[query.populationSource];
});

// Y LABEL FORMATS
const getCustomYLabelFormat = unit => {
  const formatY = {
    thousand: value => `${format('.2s')(`${value * DATA_SCALE}`)}`,
    '%': value => `${value}%`
  };
  return formatY[unit];
};

// POPULATION CHARTS
const getNationalIndicatorsForPopulation = createSelector(
  [ getNationalIndicators, getSelectedIndicatorCodes ],
  (indicators, selectedIndicatorCodes) => {
    if (!indicators) return null;
    return selectedIndicatorCodes.map(
      indCode => indicators.find(ind => ind.indicator_code === indCode)
    );
  }
);

const getNationalIndicatorsForPopulationOptions = createSelector(
  [ getIndicators, getSelectedIndicatorCodes ],
  (indicators, selectedIndicatorCodes) => {
    if (!indicators) return null;

    const options = [];

    selectedIndicatorCodes.forEach(indicatorCode => {
      const indicator = indicators &&
        indicators.indicators &&
        indicators.indicators.find(ind => ind.code === indicatorCode) ||
        null;
      if (indicator) {
        options.push({ label: indicator.name, value: indicator.code });
      }
    });
    return sortBy(options, 'label');
  }
);

const getStateIndicatorsForPopulationOptions = createSelector(
  [ getIndicators ],
  indicators => {
    if (!indicators) return null;

    const POPULATION_INDICATOR = DEFAULT_INDICATOR;
    const options = [];

    const populationStates = indicators &&
      indicators.values &&
      indicators.values.filter(
        ind =>
          ind.location_iso_code3 !== COUNTRY_ISO &&
            ind.indicator_code === POPULATION_INDICATOR
      );

    if (populationStates) {
      populationStates.forEach(
        state => options.push({ label: state.location, value: state.location })
      );
    }
    return sortBy(options, 'label');
  }
);

const getFilterOptions = createStructuredSelector({
  popNationalIndicator: getNationalIndicatorsForPopulationOptions,
  popState: getStateIndicatorsForPopulationOptions
});

const getDefaults = createSelector(getFilterOptions, options => ({
  popNationalIndicator: options.popNationalIndicator.find(
    o => o.value === DEFAULT_INDICATOR
  ),
  popState: options.popState.find(o => o.value === DEFAULT_STATE)
}));

const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = query[field];
  const options = getFilterOptions(state)[field];

  return options.find(o => o.value === queryValue);
};

const getSelectedOptions = createStructuredSelector({
  popNationalIndicator: getFieldSelected('popNationalIndicator'),
  popState: getFieldSelected('popState')
});

const getBarChartData = createSelector(
  [ getIndicators, getNationalIndicatorsForPopulation, getSelectedOptions ],
  (data, indicators, selectedOptions) => {
    if (!indicators || !data) return null;
    const queryName = 'popNationalIndicator';
    const selectedIndicator = indicators.find(
      ind => ind.indicator_code === selectedOptions[queryName].value
    );

    const code = selectedIndicator && selectedIndicator.indicator_code;
    const indicator = data &&
      data.indicators &&
      data.indicators.find(ind => ind.code === code);
    const unit = indicator && indicator.unit;

    const selectedData = [];
    selectedIndicator.values.forEach(d => {
      if (d.value && d.year) {
        selectedData.push({ x: d.year, y: d.value });
      }
    });

    const isPercentage = u => u === '%';
    const label = selectedOptions[queryName] &&
      selectedOptions[queryName].label;

    return {
      data: selectedData,
      domain: getDomain(),
      config: {
        axes: getAxes('Year', 'People'),
        tooltip: {
          y: {
            label: isPercentage(unit) ? 'Percentage' : 'People',
            format: isPercentage(unit)
              ? getCustomYLabelFormat(unit)
              : value => `${format(',r')(`${value * DATA_SCALE}`)}`
          },
          x: { label: 'Year' },
          indicator: label
        },
        animation: false,
        columns: { x: getXColumn(), y: [ { label, value: 'y' } ] },
        theme: getTheme('#2EC9DF'),
        yLabelFormat: getCustomYLabelFormat(unit)
      },
      dataOptions: getFirstChartFilter(queryName, selectedOptions),
      dataSelected: getFirstChartFilter(queryName, selectedOptions)
    };
  }
);

const getPopStateBarChartData = createSelector(
  [ getIndicators, getSelectedOptions ],
  (indicators, selectedOptions) => {
    if (!indicators || !selectedOptions) return null;
    const queryName = 'popState';

    const selectedIndicator = indicators &&
      indicators.values &&
      indicators.values.find(
        ind =>
          ind.location === selectedOptions[queryName].value &&
            ind.indicator_code === DEFAULT_INDICATOR
      );

    const indicator = indicators &&
      indicators.indicators &&
      indicators.indicators.find(ind => ind.code === DEFAULT_INDICATOR);
    const unit = indicator && indicator.unit;

    const selectedData = [];
    if (selectedIndicator) {
      selectedIndicator.values.forEach(d => {
        if (d.value && d.year) {
          selectedData.push({ x: d.year, y: d.value });
        }
      });
    }

    return {
      data: selectedData,
      domain: getDomain(),
      config: {
        axes: getAxes('Years', 'People'),
        tooltip: {
          y: {
            label: 'People',
            format: value => `${format(',.2r')(`${value * DATA_SCALE}`)}`
          },
          indicator: { label: 'Population', value: 'Population' }
        },
        animation: false,
        columns: {
          x: getXColumn(),
          y: [ { label: 'State population', value: 'y' } ]
        },
        theme: getTheme('#FC7E4B'),
        yLabelFormat: getCustomYLabelFormat(unit)
      },
      dataOptions: [ { label: 'State population' } ],
      dataSelected: [ { label: 'State population' } ]
    };
  }
);

export const getPopulation = createStructuredSelector({
  chartData: getBarChartData,
  query: getQuery,
  popStateChartData: getPopStateBarChartData,
  nationalIndicatorsOptions: getNationalIndicatorsForPopulationOptions,
  popStatesOptions: getStateIndicatorsForPopulationOptions,
  selectedOptions: getSelectedOptions
});

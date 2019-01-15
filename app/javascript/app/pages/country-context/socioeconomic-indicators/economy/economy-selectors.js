import { createStructuredSelector, createSelector } from 'reselect';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
import {
  getQuery,
  getLoading,
  getIndicators,
  getNationalIndicators,
  getFirstChartFilter,
  getXColumn,
  getTheme,
  getDomain,
  getAxes
} from '../shared/socioeconomic-selectors';

const { COUNTRY_ISO } = process.env;

const DEFAULT_STATE = 'Delhi';
const DATA_SCALE = '1000000';
export const getSourceIndicatorCode = createSelector(
  getQuery,
  query =>
    !query || !query.economySource || query.economySource === 'GDP'
      ? 'GDP'
      : 'Employment'
);

const getNationalIndicatorsForEconomy = createSelector(
  [ getSourceIndicatorCode, getNationalIndicators ],
  (indicatorCode, indicators) => {
    if (!indicators) return null;
    return indicators.filter(
      ind => ind.indicator_code.startsWith(indicatorCode)
    );
  }
);

const getIndicatorsWithLabels = createSelector(
  [ getSourceIndicatorCode, getIndicators ],
  (indicatorCode, indicators) => {
    if (!indicators || !indicators.indicators) return null;
    const indicatorsWithLabels = indicators.indicators;
    return indicatorsWithLabels.filter(
      ind => ind.code.startsWith(indicatorCode)
    );
  }
);

const getNationalIndicatorsForEconomyOptions = createSelector(
  [ getIndicatorsWithLabels ],
  indicators => {
    if (!indicators) return null;
    return sortBy(
      indicators.map(ind => ({ label: ind.name, value: ind.code })),
      'label'
    );
  }
);

const getStateIndicatorsForEconomyOptions = createSelector(
  [ getIndicators, getSourceIndicatorCode ],
  (indicators, sourceCode) => {
    if (!indicators) return null;

    const options = [];
    const economyStates = indicators &&
      indicators.values &&
      indicators.values.filter(
        ind =>
          ind.location_iso_code3 !== COUNTRY_ISO &&
            ind.indicator_code === sourceCode
      );

    if (economyStates) {
      economyStates.forEach(
        province =>
          options.push({ label: province.location, value: province.location })
      );
    }

    return sortBy(options, 'label');
  }
);

const getFilterOptions = createStructuredSelector({
  economyNationalIndicator: getNationalIndicatorsForEconomyOptions,
  economyState: getStateIndicatorsForEconomyOptions
});

const getDefaults = createSelector(
  [ getFilterOptions, getSourceIndicatorCode ],
  (options, sourceCode) => ({
    economyNationalIndicator: options &&
      options.economyNationalIndicator &&
      options.economyNationalIndicator.find(o => o.value === sourceCode),
    economyState: options &&
      options.economyState &&
      options.economyState.find(o => o.value === DEFAULT_STATE)
  })
);

const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = query[field];
  const options = getFilterOptions(state)[field];

  return options && options.find(o => o.value === queryValue);
};

const getSelectedOptions = createStructuredSelector({
  economyNationalIndicator: getFieldSelected('economyNationalIndicator'),
  economyState: getFieldSelected('economyState')
});

// Y LABEL FORMATS
const getCustomYLabelFormat = unit => {
  const formatY = {
    'billion Rupiahs': value => `${value / DATA_SCALE}B`,
    'million Rupiahs': value => `${value}M`,
    '%': value => `${value}%`
  };
  return formatY[unit];
};

const getNationalBarChartData = createSelector(
  [
    getIndicatorsWithLabels,
    getNationalIndicatorsForEconomy,
    getSelectedOptions,
    getSourceIndicatorCode
  ],
  (indicatorsWithLabels, indicators, selectedOptions, source) => {
    if (!indicators || !indicatorsWithLabels) return null;

    const queryName = 'economyNationalIndicator';

    const selectedIndicator = indicators.find(
      ind => ind.indicator_code === selectedOptions[queryName].value
    );

    const code = selectedIndicator && selectedIndicator.indicator_code;
    const indicator = indicatorsWithLabels &&
      indicatorsWithLabels.find(ind => ind.code === code);
    const unit = indicator && indicator.unit;
    const selectedData = [];
    if (selectedIndicator && selectedIndicator.values) {
      selectedIndicator.values.forEach(d => {
        if (d.value && d.year) {
          selectedData.push({ x: parseInt(d.year, 10), y: d.value });
        }
      });
    }

    const tooltipFormat = value =>
      unit === 'billion Rupiahs' ? format(',.2f')(value / DATA_SCALE) : value;

    return {
      data: selectedData,
      domain: getDomain(),
      config: {
        axes: getAxes('Years', source === 'GDP' ? 'GDP' : 'Employment'),
        tooltip: {
          y: {
            label: source === 'GDP' ? capitalize(unit) : 'People',
            format: tooltipFormat
          },
          x: { label: 'Year' },
          indicator: selectedOptions[queryName] &&
            selectedOptions[queryName].label
        },
        animation: false,
        columns: {
          x: getXColumn(),
          y: [
            {
              label: selectedOptions[queryName] &&
                selectedOptions[queryName].label,
              value: 'y'
            }
          ]
        },
        theme: getTheme('#01B4D2'),
        yLabelFormat: getCustomYLabelFormat(unit)
      },
      dataOptions: getFirstChartFilter(queryName, selectedOptions),
      dataSelected: getFirstChartFilter(queryName, selectedOptions)
    };
  }
);

const getStateBarChartData = createSelector(
  [
    getIndicatorsWithLabels,
    getIndicators,
    getSelectedOptions,
    getSourceIndicatorCode
  ],
  (indicatorsWithLabels, indicators, selectedOptions, sourceCode) => {
    if (!indicators || !indicatorsWithLabels) return null;

    const queryName = 'economyState';

    const selectedIndicator = indicators &&
      indicators.values &&
      indicators.values.find(
        ind =>
          ind.location === selectedOptions[queryName].value &&
            ind.indicator_code === sourceCode
      );

    const selectedData = [];
    if (selectedIndicator && selectedIndicator.values) {
      selectedIndicator.values.forEach(d => {
        if (d.value && d.year) {
          selectedData.push({ x: parseInt(d.year, 10), y: d.value });
        }
      });
    }

    const indicatorLabel = sourceCode === 'GDP' ? 'GDP Price' : 'Employment';
    return {
      data: selectedData,
      domain: getDomain(),
      config: {
        axes: getAxes('Years', sourceCode === 'GDP' ? 'GDP' : 'Employment'),
        tooltip: {
          y: {
            label: sourceCode === 'GDP' ? 'Rupiahs' : 'People',
            format: value => `${format(',')(value)}`
          },
          x: { label: 'Year' },
          indicator: sourceCode === 'GDP'
            ? 'GDP at current price'
            : 'Employment'
        },
        animation: false,
        columns: {
          x: getXColumn(),
          y: [ { label: indicatorLabel, value: 'y' } ]
        },
        theme: getTheme('#FC7E4B'),
        yLabelFormat: value =>
          `${format('.2s')(value)}${sourceCode === 'GDP' ? 'R' : ''}`
      },
      dataOptions: [ { label: indicatorLabel } ],
      dataSelected: [ { label: indicatorLabel } ]
    };
  }
);

export const getEconomy = createStructuredSelector({
  query: getQuery,
  nationalChartData: getNationalBarChartData,
  stateChartData: getStateBarChartData,
  nationalOptions: getNationalIndicatorsForEconomyOptions,
  statesOptions: getStateIndicatorsForEconomyOptions,
  selectedOptions: getSelectedOptions,
  loading: getLoading,
  selectedSource: getSourceIndicatorCode
});

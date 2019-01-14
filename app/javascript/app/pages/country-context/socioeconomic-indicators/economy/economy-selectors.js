import { createStructuredSelector, createSelector } from 'reselect';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
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

const { COUNTRY_ISO } = process.env;

const DEFAULT_STATE = 'Delhi';
const DATA_SCALE = '1000000';
const getSourceIndicatorCode = createSelector(
  getQuery,
  query => !query || !query.economySource ? 'GDP' : 'Employment'
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

const getProvinceIndicatorsForEconomyOptions = createSelector(
  [ getIndicators, getSourceIndicatorCode ],
  (indicators, sourceCode) => {
    if (!indicators) return null;

    const options = [];
    const economyProvinces = indicators &&
      indicators.values &&
      indicators.values.filter(
        ind =>
          ind.location_iso_code3 !== COUNTRY_ISO &&
            ind.indicator_code === sourceCode
      );

    if (economyProvinces) {
      economyProvinces.forEach(
        province =>
          options.push({ label: province.location, value: province.location })
      );
    }

    return sortBy(options, 'label');
  }
);

const getFilterOptions = createStructuredSelector({
  gdpNationalIndicator: getNationalIndicatorsForEconomyOptions,
  gdpProvince: getProvinceIndicatorsForEconomyOptions
});

const getDefaults = createSelector(
  [ getFilterOptions, getSourceIndicatorCode ],
  (options, sourceCode) => ({
    gdpNationalIndicator: options &&
      options.gdpNationalIndicator &&
      options.gdpNationalIndicator.find(o => o.value === sourceCode),
    gdpProvince: options &&
      options.gdpProvince &&
      options.gdpProvince.find(o => o.value === DEFAULT_STATE)
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
  gdpNationalIndicator: getFieldSelected('gdpNationalIndicator'),
  gdpProvince: getFieldSelected('gdpProvince')
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
    getSelectedOptions
  ],
  (indicatorsWithLabels, indicators, selectedOptions) => {
    if (!indicators || !indicatorsWithLabels) return null;

    const queryName = 'gdpNationalIndicator';

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
        axes: getAxes('Years', 'GDP'),
        tooltip: {
          y: { label: capitalize(unit), format: tooltipFormat },
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

const getProvincialBarChartData = createSelector(
  [
    getIndicatorsWithLabels,
    getIndicators,
    getSelectedOptions,
    getSourceIndicatorCode
  ],
  (indicatorsWithLabels, indicators, selectedOptions, sourceCode) => {
    if (!indicators || !indicatorsWithLabels) return null;

    const queryName = 'gdpProvince';

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

    return {
      data: selectedData,
      domain: getDomain(),
      config: {
        axes: getAxes('Years', 'GDP'),
        tooltip: {
          y: { label: 'Rupiahs', format: value => `${format(',')(value)}` },
          x: { label: 'Year' },
          indicator: 'GDP at current price'
        },
        animation: false,
        columns: { x: getXColumn(), y: [ { label: 'GDP Price', value: 'y' } ] },
        theme: getTheme('#FC7E4B'),
        yLabelFormat: value => `${format('.2s')(value)}R`
      },
      dataOptions: [ { label: 'GDP Price' } ],
      dataSelected: [ { label: 'GDP Price' } ]
    };
  }
);

export const getEconomy = createStructuredSelector({
  query: getQuery,
  nationalChartData: getNationalBarChartData,
  provincialChartData: getProvincialBarChartData,
  nationalOptions: getNationalIndicatorsForEconomyOptions,
  provincesOptions: getProvinceIndicatorsForEconomyOptions,
  selectedOptions: getSelectedOptions
});

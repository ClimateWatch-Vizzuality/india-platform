import { createStructuredSelector, createSelector } from 'reselect';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
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
  getIndicatorsValues,
  getXColumn,
  getDomain,
  getAxes
} from '../shared/socioeconomic-selectors';

const DATA_SCALE = '1000000';
const MAX_CHART_LEGEND_ELEMENTS = 5;

const getUniqueYears = data => {
  const allYears = flatten(
    data.map(d => d.values).map(arr => arr.map(o => o.year))
  );
  return [...new Set(allYears)];
};

const getYColumn = data =>
  data.map(d => ({ label: d.label, value: d.category || d.key }));

const unitLabels = { unit: '₹ Billion', million: 'People', '%': 'Percentage' };
export const getSourceIndicatorCode = createSelector(
  getQuery,
  query =>
    !query || !query.economySource || query.economySource === 'GDP'
      ? 'GDP'
      : 'Employment'
);
const getEconomyIndicatorsValues = createSelector(
  [getSourceIndicatorCode, getIndicatorsValues],
  (indicatorCode, indicators) => {
    if (!indicators) return null;
    return indicators.filter(ind =>
      ind.indicator_code.startsWith(indicatorCode));
  }
);
const getIndicatorsWithLabels = createSelector(
  [getSourceIndicatorCode, getIndicators],
  (indicatorCode, indicators) => {
    if (!indicators || !indicators.indicators) return null;
    const indicatorsWithLabels = indicators.indicators;
    return indicatorsWithLabels.filter(ind =>
      ind.code.startsWith(indicatorCode));
  }
);
const getEconomyIndicatorsValuesOptions = createSelector(
  [getIndicatorsWithLabels],
  indicators => {
    if (!indicators) return null;
    return upperCaseLabels(
      sortBy(
        indicators.map(ind => ({ label: ind.name, value: ind.code })),
        'label'
      )
    );
  }
);
const getSelectedIndicator = createSelector(
  [getQuery, getEconomyIndicatorsValuesOptions, getSourceIndicatorCode],
  (query, options, indicatorCode) => {
    if (!query || !query.economyNationalIndicator)
      return options && options.find(o => o.value === indicatorCode);
    return (
      options && options.find(o => o.value === query.economyNationalIndicator)
    );
  }
);
const getSelectedIndicatorsValues = createSelector(
  [getEconomyIndicatorsValues, getSelectedIndicator],
  (indicators, selectedIndicator) => {
    if (!indicators) return null;
    return indicators.filter(
      ind => ind.indicator_code === selectedIndicator.value
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
    if (!query || !query.economyState)
      return [{ value: options[0].value, label: options[0].label }];
    const queryArray = query.economyState.split(',');
    const statesSelected = queryArray.map(q => {
      const statesData = options.find(o => o.value === q);
      return statesData && { label: statesData.label, value: statesData.value };
    });
    return statesSelected;
  }
);

const getChartRawData = createSelector(
  [getSelectedIndicatorsValues, getSelectedStates, getSelectedIndicator],
  (selectedIndicatorValues, selectedStates, selectedIndicator) => {
    if (!selectedIndicatorValues) return null;
    if (selectedIndicator && selectedIndicator.value === 'GDP_sector')
      return selectedIndicatorValues.map(i => ({
        values: i.values,
        key: `y${upperFirst(camelCase(i.category))}`,
        label: `${upperFirst(i.category)}`,
        id: i.location_iso_code3,
        value: i.location_iso_code3,
        category: `y${upperFirst(camelCase(i.category))}`
      }));
    return selectedStates.map(st => {
      const stateData = selectedIndicatorValues.find(
        i => i.location_iso_code3 === st.value
      );
      return {
        values: stateData.values,
        key: stateData.category
          ? `y${upperFirst(camelCase(stateData.category))}`
          : `y${upperFirst(camelCase(stateData.location_iso_code3))}`,
        label: stateData.category
          ? `${upperFirst(stateData.category)}`
          : stateData.location,
        id: stateData.location_iso_code3,
        value: stateData.location_iso_code3,
        category:
          stateData.category && `y${upperFirst(camelCase(stateData.category))}`
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
); // Y LABEL FORMATS
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
    getSourceIndicatorCode,
    getSelectedIndicator,
    getStatesSelectionOptions,
    getChartRawData,
    getChartXYvalues,
    getSelectedStates
  ],
  (
    indicatorsWithLabels,
    source,
    selectedIndicator,
    selectionOptions,
    rawData,
    chartXYvalues,
    selectedStates
  ) => {
    if (!indicatorsWithLabels) return null;

    const code = selectedIndicator.value;
    const indicator =
      indicatorsWithLabels &&
      indicatorsWithLabels.find(ind => ind.code === code);

    const unit = indicator && indicator.unit;
    const theme = getThemeConfig(getYColumn(rawData, CHART_COLORS));
    return {
      data: chartXYvalues,
      domain: getDomain(),
      config: {
        axes: getAxes('Years', source === 'GDP' ? 'GDP' : 'Employment'),
        tooltip: {
          ...getTooltipConfig(getYColumn(rawData)),
          x: { label: 'Year' },
          indicator: unitLabels[unit] ? unitLabels[unit] : unit,
          theme,
          formatFunction: value =>
            `${format(',.4s')(`${value}`).replace('G', 'B')}`
        },
        animation: false,
        columns: { x: getXColumn(), y: getYColumn(rawData) },
        theme,
        yLabelFormat: getCustomYLabelFormat(unit)
      },
      dataOptions:
        selectedIndicator.value !== 'GDP_sector'
          ? setLegendOptions(
              selectionOptions,
              selectedStates,
              MAX_CHART_LEGEND_ELEMENTS
            )
          : null,
      dataSelected: selectedStates
    };
  }
);
const getSelectedIndicatorCodes = createSelector(
  [getIndicators, getSourceIndicatorCode],
  (indicators, sourceIndicatorCode) => {
    if (!indicators || !indicators.indicators || !sourceIndicatorCode)
      return [];
    return indicators.indicators
      .filter(i => i.code.startsWith(sourceIndicatorCode))
      .map(i => i.code);
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
export const getEconomy = createStructuredSelector({
  query: getQuery,
  nationalChartData: getNationalBarChartData,
  nationalOptions: getEconomyIndicatorsValuesOptions,
  selectedIndicator: getSelectedIndicator,
  loading: getLoading,
  selectedSource: getSourceIndicatorCode,
  sources: getSources,
  downloadURI: getDownloadURI
});

import { createStructuredSelector, createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { upperCaseLabels } from 'utils/utils';
import { getThemeConfig, getTooltipConfig, CHART_COLORS } from 'utils/graphs';
import {
  getQuery,
  getLoading,
  getIndicators,
  getIndicatorsValues,
  getXColumn,
  getDomain,
  getAxes
} from '../shared/socioeconomic-selectors';

const { COUNTRY_ISO } = process.env;

const DATA_SCALE = '1000000';

const getUniqueYears = data => {
  const allYears = flatten(
    data
      .map(d => d.values)
      .map(arr => arr.map(o => o.year))
  );
  return [ ...new Set(allYears) ];
};

const getYColumn = data =>
  data.map(d => ({ label: d.label, value: d.category || d.key }));

export const getSourceIndicatorCode = createSelector(
  getQuery,
  query =>
    !query || !query.economySource || query.economySource === 'GDP'
      ? 'GDP'
      : 'Employment'
);

const getEconomyIndicatorsValues = createSelector(
  [ getSourceIndicatorCode, getIndicatorsValues ],
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

const getEconomyIndicatorsValuesOptions = createSelector(
  [ getIndicatorsWithLabels ],
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

    return upperCaseLabels(sortBy(options, 'label'));
  }
);

const getSelectedIndicator = createSelector(
  [ getQuery, getEconomyIndicatorsValuesOptions, getSourceIndicatorCode ],
  (query, options, indicatorCode) => {
    if (!query || !query.economyNationalIndicator)
      return options && options.find(o => o.value === indicatorCode);
    return options &&
      options.find(o => o.value === query.economyNationalIndicator);
  }
);

// Y LABEL FORMATS
const getCustomYLabelFormat = unit => {
  const formatY = {
    'billion Rupiahs': value => `${value / DATA_SCALE}B`,
    'million Rupiahs': value => `${value}M`,
    '%': value => `${value}%`
  };
  return formatY[unit];
};
let colorThemeCache;
const getNationalBarChartData = createSelector(
  [
    getIndicatorsWithLabels,
    getEconomyIndicatorsValues,
    getSourceIndicatorCode,
    getSelectedIndicator
  ],
  (indicatorsWithLabels, indicators, source, selectedIndicator) => {
    if (!indicators || !indicatorsWithLabels) return null;

    const code = selectedIndicator.value;

    const selectedIndicatorValues = indicators.filter(
      ind => ind.indicator_code === code
    );
    const indicator = indicatorsWithLabels &&
      indicatorsWithLabels.find(ind => ind.code === code);
    const unit = indicator && indicator.unit;

    const rawData = selectedIndicatorValues.map(i => ({
      values: i.values,
      key: i.category
        ? `y${upperFirst(camelCase(i.category))}`
        : `y${upperFirst(camelCase(i.location_iso_code3))}`,
      label: i.category ? `${upperFirst(i.category)}` : i.location,
      id: i.location_iso_code3,
      value: i.location_iso_code3,
      category: i.category && `y${upperFirst(camelCase(i.category))}`
    }));

    const chartData = getUniqueYears(rawData).map(year => {
      const yValues = {};
      rawData.forEach(({ values, key }) => {
        const valueForYear = values.find(o => o.year === year);
        yValues[key] = valueForYear && valueForYear.value || undefined;
      });
      return { x: parseInt(year, 10), ...yValues };
    });

    const theme = getThemeConfig(getYColumn(rawData, CHART_COLORS));
    colorThemeCache = { ...theme, ...colorThemeCache };

    return {
      data: chartData,
      domain: getDomain(),
      config: {
        axes: getAxes('Years', source === 'GDP' ? 'GDP' : 'Employment'),
        tooltip: {
          ...getTooltipConfig(getYColumn(rawData)),
          x: { label: 'Year' },
          indicator: selectedIndicator && selectedIndicator.label
        },
        animation: false,
        columns: { x: getXColumn(), y: getYColumn(rawData) },
        theme: colorThemeCache,
        yLabelFormat: getCustomYLabelFormat(unit)
      },
      dataOptions: selectedIndicator && [ { label: selectedIndicator.label } ],
      dataSelected: selectedIndicator && [ { label: selectedIndicator.label } ]
    };
  }
);

const getSelectedIndicatorCodes = createSelector(
  [ getIndicators, getSourceIndicatorCode ],
  (indicators, sourceIndicatorCode) => {
    if (!indicators || !indicators.indicators || !sourceIndicatorCode)
      return [];
    return indicators.indicators
      .filter(i => i.code.startsWith(sourceIndicatorCode))
      .map(i => i.code);
  }
);

const getSelectedIndicatorValues = createSelector(
  [ getSelectedIndicatorCodes, getIndicators ],
  (indicatorCodes, indicators) => {
    if (!indicators || !indicators.values || !indicatorCodes) return [];
    return indicators.values.filter(
      v => indicatorCodes.includes(v.indicator_code)
    );
  }
);

const getSources = createSelector(
  [ getSelectedIndicatorValues ],
  iValues => uniq(iValues.map(i => i.source))
);

const getDownloadURI = createSelector(
  [ getSources, getSelectedIndicatorCodes ],
  (sources, indicatorCodes) =>
    `socioeconomic/indicators.zip?code=${indicatorCodes.join(
      ','
    )}&source=${sources.join(',')}`
);

export const getEconomy = createStructuredSelector({
  query: getQuery,
  nationalChartData: getNationalBarChartData,
  nationalOptions: getEconomyIndicatorsValuesOptions,
  statesOptions: getStateIndicatorsForEconomyOptions,
  selectedIndicator: getSelectedIndicator,
  loading: getLoading,
  selectedSource: getSourceIndicatorCode,
  sources: getSources,
  downloadURI: getDownloadURI
});

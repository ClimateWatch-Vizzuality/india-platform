import { createStructuredSelector, createSelector } from 'reselect';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { upperCaseLabels } from 'utils/utils';
import { getThemeConfig, getTooltipConfig, CHART_COLORS } from 'utils/graphs';
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
  CAIT: [ 'population_3', 'population_4', 'population_5', 'pop_density' ],
  population_by_gender: [
    'population_1',
    'population_2',
    'Sex_ratio',
    'Sex_ratio_child'
  ],
  hdi: [ 'hdi' ]
};

const unitLabels = {
  pop_density: 'per sq km',
  Sex_ratio: 'female per 1000 male',
  Sex_ratio_child: 'number of children per 1000 male',
  '%': 'Percentage',
  hdi: 'Index'
};

const DATA_SCALE = 1000;

const formatY = {
  'number of female per 1000 male': value => `${value}`,
  'per square km': value => `${value}`,
  thousand: value => `${format('.2s')(`${value * DATA_SCALE}`)}`,
  million: value => `${format('.2s')(`${value}`).replace('G', 'B')}`,
  '%': value => `${value}%`,
  index: value => `${value}`
};
const getCustomYLabelFormat = unit => formatY[unit];

const getUniqueYears = data => {
  const allYears = flatten(
    data
      .map(d => d.values)
      .map(arr => arr.map(o => o.year))
  );
  return [ ...new Set(allYears) ];
};

const getYColumn = data => data.map(d => ({ label: d.label, value: d.key }));

const getSelectedIndicatorCodes = createSelector(getQuery, query => {
  if (!query || !query.populationSource) return INDICATOR_CODES.CAIT;
  return INDICATOR_CODES[query.populationSource];
});

const getSourceIndicatorCode = createSelector(
  getQuery,
  query => !query || !query.populationSource ? 'CAIT' : query.populationSource
);

const getDefaultIndicator = createSelector(getQuery, query => {
  if (!query || !query.populationSource) return DEFAULT_INDICATOR.CAIT;
  return DEFAULT_INDICATOR[query.populationSource];
});

const getSelectedIndicators = createSelector(
  [ getNationalIndicators, getSelectedIndicatorCodes ],
  (nationalIndicators, selectedIndicatorCodes) => {
    if (!nationalIndicators) return null;
    return selectedIndicatorCodes.map(
      code => nationalIndicators.find(i => i.indicator_code === code)
    );
  }
);

const getSelectedIndicatorsOptions = createSelector(
  [ getIndicatorsMetadata, getSelectedIndicatorCodes ],
  (indicatorsMetadata, selectedIndicatorCodes) => {
    if (!indicatorsMetadata) return null;
    return upperCaseLabels(
      sortBy(
        selectedIndicatorCodes.map(code => {
          const meta = indicatorsMetadata.find(i => i.code === code);
          return { label: meta.name, value: meta.code };
        }),
        'label'
      )
    );
  }
);

const getSelectedIndicator = createSelector(
  [ getQuery, getSelectedIndicatorsOptions, getDefaultIndicator ],
  (query, indicatorsOptions, defaultIndicator) => {
    if (!indicatorsOptions) return null;
    if (!query || !query.popNationalIndicator)
      return indicatorsOptions.find(o => o.value === defaultIndicator);
    return indicatorsOptions.find(o => o.value === query.popNationalIndicator);
  }
);

const getProvincesOptions = createSelector(
  [ getProvincesIndicators, getSelectedIndicator ],
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

const getSelectedProvinces = createSelector([ getQuery, getProvincesOptions ], (
  query,
  options
) =>
  {
    if (!query || !query.popState || !options) return [];
    const queryArray = query.popState.split(',');
    const provincesSelected = queryArray
      .filter(str => str !== 'IND')
      .map(q => {
        const provinceData = options.find(o => o.value === q);
        return provinceData &&
          {
            label: provinceData.label,
            value: provinceData.value,
            id: provinceData.value
          };
      });
    return provincesSelected;
  });

let colorThemeCache;

const getBarChartData = createSelector(
  [
    getQuery,
    getIndicators,
    getSelectedIndicators,
    getProvincesOptions,
    getSelectedProvinces,
    getProvincesIndicators,
    getSelectedIndicator
  ],
  (
    query,
    data,
    indicators,
    provinces,
    selectedProvinces,
    provincesIndicators,
    selectedIndicator
  ) =>
    {
      if (!indicators || !data || !provincesIndicators) return null;
      const nationalData = indicators.find(
        ind => ind.indicator_code === selectedIndicator.value
      );
      const provinceData = selectedProvinces.map(
        p =>
          provincesIndicators.find(
            i =>
              i.location_iso_code3 === p.value &&
                i.indicator_code === selectedIndicator.value
          )
      );

      const queryArray = query && query.popState && query.popState.split(',');
      const addNationalData = queryArray &&
        queryArray.some(str => str === 'IND') ||
        (!query || !query.popState);

      if (!nationalData) return null;
      const code = nationalData && nationalData.indicator_code;
      const indicator = data &&
        data.indicators &&
        data.indicators.find(ind => ind.code === code);
      const unit = indicator && indicator.unit;

      const nationalChartData = {
        values: nationalData.values,
        key: `y${upperFirst(camelCase(nationalData.location_iso_code3))}`,
        label: nationalData.location,
        id: nationalData.location_iso_code3,
        value: nationalData.location_iso_code3
      };

      const provincesChartData = provinceData.map(i => ({
        values: i.values,
        key: `y${upperFirst(camelCase(i.location_iso_code3))}`,
        label: i.location,
        id: i.location_iso_code3,
        value: i.location_iso_code3
      }));

      const chartData = addNationalData
        ? [ nationalChartData, ...provincesChartData ]
        : provincesChartData;

      const D = getUniqueYears(chartData).map(year => {
        const yValues = {};
        chartData.forEach(({ values, key }) => {
          const valueForYear = values.find(o => o.year === year);
          yValues[key] = valueForYear && valueForYear.value || undefined;
        });
        return { x: year, ...yValues };
      });

      const { value: selectedIndicatorValue } = selectedIndicator;
      const theme = getThemeConfig(getYColumn(chartData, CHART_COLORS));
      colorThemeCache = { ...theme, ...colorThemeCache };
      return {
        data: D,
        domain: getDomain(),
        config: {
          axes: getAxes('Year', 'People'),
          tooltip: {
            ...getTooltipConfig(getYColumn(chartData)),
            x: { label: 'Year' },
            indicator: unitLabels[selectedIndicatorValue]
              ? unitLabels[selectedIndicatorValue]
              : 'People',
            theme: colorThemeCache,
            formatFunction: formatY[unit]
              ? getCustomYLabelFormat(unit)
              : value => `${format(',.4s')(`${value}`).replace('G', 'B')}`
          },
          animation: false,
          columns: { x: getXColumn(), y: getYColumn(chartData) },
          theme: colorThemeCache,
          yLabelFormat: getCustomYLabelFormat(unit)
        },
        dataOptions: [ { label: 'India', value: 'IND' }, ...provinces ],
        dataSelected: chartData
      };
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

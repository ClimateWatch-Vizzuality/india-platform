import { createStructuredSelector, createSelector } from 'reselect';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { upperCaseLabels } from 'utils/utils';
import { getThemeConfig, getTooltipConfig } from 'utils/graphs';
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
  age_and_gender: 'Sex_ratio',
  hdi: 'hdi'
};
const INDICATOR_CODES = {
  CAIT: [
    'population_1',
    'population_2',
    'population_3',
    'population_4',
    'pop_density'
  ],
  age_and_gender: [ 'Sex_ratio' ],
  hdi: [ 'hdi' ]
};
const DATA_SCALE = 1000;

const getCustomYLabelFormat = unit => {
  const formatY = {
    thousand: value => `${format('.2s')(`${value * DATA_SCALE}`)}`,
    million: value => `${format('.2s')(`${value}`).replace('G', 'B')}`,
    '%': value => `${value}%`
  };
  return formatY[unit];
};

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
      .filter(str => str !== '')
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

const getBarChartData = createSelector(
  [
    getIndicators,
    getSelectedIndicators,
    getProvincesOptions,
    getSelectedProvinces,
    getProvincesIndicators,
    getSelectedIndicator
  ],
  (
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

      if (!nationalData) return null;
      const code = nationalData && nationalData.indicator_code;
      const indicator = data &&
        data.indicators &&
        data.indicators.find(ind => ind.code === code);
      const unit = indicator && indicator.unit;

      const chartData = [ nationalData, ...provinceData ].map(i => ({
        values: i.values,
        key: `y${upperFirst(camelCase(i.location_iso_code3))}`,
        label: i.location,
        id: i.location_iso_code3
      }));

      const D = getUniqueYears(chartData).map(year => {
        const yValues = {};
        chartData.forEach(({ values, key }) => {
          const valueForYear = values.find(o => o.year === year);
          yValues[key] = valueForYear && valueForYear.value || undefined;
        });
        return { x: year, ...yValues };
      });

      const isPercentage = u => u === '%';
      const { label } = selectedIndicator;

      return {
        data: D,
        domain: getDomain(),
        config: {
          axes: getAxes('Year', 'People'),
          tooltip: {
            ...getTooltipConfig(getYColumn(chartData)),
            x: { label: 'Year' },
            indicator: label,
            theme: getThemeConfig(getYColumn(chartData)),
            labelFunction: isPercentage(unit) ? 'Percentage' : 'People',
            formatFunction: isPercentage(unit)
              ? getCustomYLabelFormat(unit)
              : value => `${format(',.4s')(`${value}`).replace('G', 'B')}`
          },
          animation: false,
          columns: { x: getXColumn(), y: getYColumn(chartData) },
          theme: getThemeConfig(getYColumn(chartData)),
          yLabelFormat: getCustomYLabelFormat(unit)
        },
        dataOptions: provinces,
        dataSelected: [ ...selectedProvinces, { label: 'India', value: 'IND' } ]
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

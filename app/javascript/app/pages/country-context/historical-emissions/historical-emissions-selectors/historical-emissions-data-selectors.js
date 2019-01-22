import { createStructuredSelector, createSelector } from 'reselect';
import isArray from 'lodash/isArray';
import castArray from 'lodash/castArray';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import {
  ALL_SELECTED,
  METRIC_API_FILTER_NAMES,
  SECTOR_TOTAL
} from 'constants/constants';

import {
  getThemeConfig,
  getTooltipConfig,
  DEFAULT_AXES_CONFIG,
  getYColumnValue
} from 'utils/graphs';

import {
  getEmissionsData,
  getMetadata
} from './historical-emissions-get-selectors';
import {
  getSelectedOptions,
  getFilterOptions
} from './historical-emissions-filter-selectors';

const FRONTEND_FILTERED_FIELDS = [ 'sector' ];

const getUnit = createSelector([ getMetadata, getSelectedOptions ], (
  meta,
  selectedOptions
) =>
  {
    if (!meta || !selectedOptions.metric) return null;
    const { metric: metrics } = meta;
    const metricObject = metrics &&
      metrics.find(
        m => METRIC_API_FILTER_NAMES[selectedOptions.metric] === m.code
      );
    return metricObject && metricObject.unit;
  });

export const getScale = createSelector([ getUnit ], unit => {
  if (!unit) return 1;
  if (unit.startsWith('kt')) return 1000;
  return 1;
});

const getCorrectedUnit = createSelector([ getUnit, getScale ], (unit, scale) =>
  {
    if (!unit || !scale) return null;
    return unit.replace('kt', 't');
  });

const getLegendDataOptions = createSelector(
  [ getFilterOptions ],
  options => options ? options.sector : null
);

const getLegendDataSelected = createSelector(
  [ getSelectedOptions, getFilterOptions ],
  (selectedOptions, options) => {
    if (!selectedOptions || !selectedOptions.sector || !options) return null;

    const dataSelected = selectedOptions.sector;
    if (!isArray(dataSelected)) {
      if (dataSelected.value === ALL_SELECTED) return options.sector;
    }
    return isArray(dataSelected) ? dataSelected : [ dataSelected ];
  }
);

const getYColumnOptions = createSelector(
  [ getLegendDataSelected, getSelectedOptions ],
  (legendDataSelected, selectedOptions) => {
    if (!legendDataSelected) return null;
    const removeTotalSector = d =>
      selectedOptions.metric !== 'absolute' || d.code !== SECTOR_TOTAL;
    const getYOption = columns =>
      columns &&
        columns
          .map(d => ({
            label: d && d.label,
            value: d && getYColumnValue(`sector${d.value}`),
            code: d && (d.code || d.label)
          }))
          .filter(removeTotalSector);
    return uniqBy(getYOption(legendDataSelected), 'value');
  }
);

const filterBySelectedOptions = (
  emissionsData,
  metricSelected,
  selectedOptions
) =>
  {
    const fieldPassesFilter = (selectedFilterOption, field, data) =>
      castArray(selectedFilterOption).some(
        o => o.value === ALL_SELECTED || o.code === data[field]
      );
    const absoluteMetric = METRIC_API_FILTER_NAMES.absolute;

    return emissionsData
      .filter(d => d.metric === METRIC_API_FILTER_NAMES[metricSelected])
      .filter(
        d =>
          d.metric === absoluteMetric && d.sector !== SECTOR_TOTAL ||
            d.metric !== absoluteMetric
      )
      .filter(
        d =>
          FRONTEND_FILTERED_FIELDS.every(
            field => fieldPassesFilter(selectedOptions[field], field, d)
          )
      );
  };

const parseChartData = createSelector(
  [
    getEmissionsData,
    getYColumnOptions,
    getSelectedOptions,
    getCorrectedUnit,
    getScale
  ],
  (emissionsData, yColumnOptions, selectedOptions, unit, scale) => {
    if (
      !emissionsData ||
        isEmpty(emissionsData) ||
        !selectedOptions.metric ||
        !yColumnOptions
    )
      return null;
    const yearValues = emissionsData[0].emissions.map(d => d.year);

    const filteredData = filterBySelectedOptions(
      emissionsData,
      selectedOptions.metric,
      selectedOptions
    );
    const dataParsed = [];
    yearValues.forEach(x => {
      const yItems = {};
      filteredData.forEach(d => {
        const columnObject = yColumnOptions.find(c => c.code === d.sector);
        const yKey = columnObject && columnObject.value;

        if (yKey) {
          const yData = d.emissions.find(e => e.year === x);
          if (yData && yData.value) {
            yItems[yKey] = (yItems[yKey] || 0) + yData.value * scale;
          }
        }
      });
      const item = { x, ...yItems };

      if (!isEmpty({ ...yItems })) dataParsed.push(item);
    });
    return dataParsed;
  }
);

let colorCache = {};

export const getChartConfig = createSelector(
  [ parseChartData, getSelectedOptions, getCorrectedUnit, getYColumnOptions ],
  (data, selectedOptions, unit, yColumnOptions) => {
    if (!data || isEmpty(data) || !selectedOptions.metric) return null;

    const columnsWithData = Object.keys(data[0]);
    const yColumnsWithData = yColumnOptions.filter(
      c => columnsWithData.includes(c.value)
    );
    const tooltip = getTooltipConfig(yColumnsWithData);
    const theme = getThemeConfig(yColumnsWithData);
    colorCache = { ...theme, ...colorCache };
    const axes = {
      ...DEFAULT_AXES_CONFIG,
      yLeft: { ...DEFAULT_AXES_CONFIG.yLeft, unit: unit || 't' }
    };

    const config = {
      axes,
      theme: colorCache,
      tooltip,
      animation: false,
      columns: {
        x: [ { label: 'year', value: 'x' } ],
        y: yColumnsWithData.map(c => ({ ...c, stackId: 'stack1' }))
      }
    };
    return config;
  }
);

const getChartLoading = ({ metadata = {}, GHGEmissions = {} }) =>
  metadata && metadata.ghg.loading || GHGEmissions && GHGEmissions.loading;

const getDataLoading = createSelector(
  [ getChartLoading, parseChartData ],
  (loading, data) => loading || !data || false
);

export const getChartData = createStructuredSelector({
  data: parseChartData,
  config: getChartConfig,
  loading: getDataLoading,
  dataOptions: getLegendDataOptions,
  dataSelected: getLegendDataSelected
});

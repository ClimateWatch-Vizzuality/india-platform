import { createSelector } from 'reselect';

import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';

import {
  getThemeConfig,
  getTooltipConfig,
  getYColumnValue
} from 'utils/graphs';

const getAllCategories = indicator =>
  uniq(indicator.progress_records.map(r => r.category));

const getAxes = indicator => ({
  xBottom: { name: 'AxisX', unit: '', format: 'string' },
  yLeft: { name: 'Reporting value', unit: indicator.unit, format: 'number' }
});

const getBarChartData = indicator => {
  const data = indicator.progress_records.map(record => ({
    x: record.axis_x,
    y: Number(record.value)
  }));
  const yColumns = [ { label: 'Reporting value', value: 'y' } ];

  return {
    data,
    dataOptions: yColumns,
    dataSelected: yColumns,
    domain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
    config: {
      axes: getAxes(indicator),
      tooltip: { y: { label: indicator.unit } },
      animation: false,
      columns: { x: [ { label: '', value: 'x' } ], y: yColumns },
      theme: getThemeConfig(yColumns)
    }
  };
};

const getStackedBarChartData = (indicator, selectedCategories) => {
  const categories = getAllCategories(indicator);
  const dataGroupedByAxisX = groupBy(indicator.progress_records, 'axis_x');
  const categoryToLegendObject = c => ({ label: c, value: c });

  const data = Object
    .keys(dataGroupedByAxisX)
    .map(axisX => ({
      x: axisX,
      ...dataGroupedByAxisX[axisX].reduce(
        (acc, d) => ({ ...acc, [getYColumnValue(d.category)]: d.value }),
        {}
      )
    }));
  const yColumns = selectedCategories.map(c => ({
    label: c,
    value: getYColumnValue(c),
    stackId: 'stack'
  }));
  const dataSelected = selectedCategories.map(categoryToLegendObject);
  const dataOptions = categories.map(categoryToLegendObject);

  return {
    data,
    dataOptions,
    dataSelected,
    domain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
    config: {
      axes: getAxes(indicator),
      animation: false,
      columns: { x: [ { label: '', value: 'x' } ], y: yColumns },
      theme: getThemeConfig(yColumns),
      tooltip: getTooltipConfig(yColumns)
    }
  };
};

const getSelectedCategories = indicator => state => {
  const { query } = state.location;
  const fieldName = `${indicator.code}_category`;
  const value = query && query[fieldName];

  if (!value) return getAllCategories(indicator);

  return value.split(',');
};

export const getQuery = ({ location }) => location && location.query || null;
export const getChartData = (chartType, indicator) =>
  createSelector([ getSelectedCategories(indicator) ], selectedCategories => {
    if (!get(indicator, 'progress_records.length')) return null;

    if (chartType === 'bar') return getBarChartData(indicator);
    if (chartType === 'stacked_bar')
      return getStackedBarChartData(indicator, selectedCategories);

    return null;
  });

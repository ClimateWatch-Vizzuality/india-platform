import { createStructuredSelector, createSelector } from 'reselect';
import { format } from 'd3-format';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import { ALL_SELECTED, ALL_SELECTED_OPTION } from 'constants/constants';
import {
  getYColumnValue,
  getThemeConfig,
  getTooltipConfig
} from 'utils/graphs';

export const getQuery = ({ location }) => location && location.query || null;

export const getFunds = ({ climateFinance }) =>
  climateFinance && climateFinance.data;
export const getLoading = ({ climateFinance }) => !climateFinance;
export const getDomain = () => ({ x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] });

export const getAxes = (xName, yName) => ({
  xBottom: { name: xName, unit: '', format: 'string' },
  yLeft: { name: yName, unit: '', format: 'number' }
});

export const getXColumn = () => [ { label: 'year', value: 'x' } ];

const getFundOptions = createSelector([ getFunds ], funds => {
  if (!funds || isEmpty(funds)) return null;
  const availableFunds = uniq(funds.map(c => c.source));
  return [
    ALL_SELECTED_OPTION,
    ...availableFunds.map(f => ({ label: f, value: f }))
  ];
});

const getSelectedOption = createSelector([ getFundOptions, getQuery ], (
  options,
  query
) =>
  {
    if (!options) return null;
    if (!query || query.fund === ALL_SELECTED) return [ ALL_SELECTED_OPTION ];
    return options.filter(o => query.fund.split(',').includes(o.value));
  });

const getFilteredData = createSelector([ getFunds, getSelectedOption ], (
  data,
  selectedOption
) =>
  {
    if (!data || isEmpty(data)) return null;
    let filteredData = data;
    const selectedOptions = selectedOption && selectedOption.map(s => s.value);
    if (selectedOptions && !selectedOptions.includes(ALL_SELECTED)) {
      filteredData = data.filter(d => selectedOptions.includes(d.source));
    }
    return filteredData;
  });

const getDataSelected = createSelector([ getFundOptions, getSelectedOption ], (
  options,
  selectedOption
) =>
  {
    if (!options) return null;
    if (selectedOption.includes(ALL_SELECTED_OPTION)) return options;
    return selectedOption;
  });

const getYColumns = createSelector(
  [ getFunds, getFundOptions, getDataSelected ],
  (data, options, selectedOption) => {
    if (!data || isEmpty(data)) return null;

    let yColumns = [];
    const selectedOptions = selectedOption && selectedOption.map(s => s.value);
    if (selectedOptions && !selectedOptions.includes(ALL_SELECTED)) {
      yColumns = selectedOptions.map(s => ({
        label: s,
        value: getYColumnValue(s)
      }));
    } else {
      options.forEach(o => {
        if (o.value !== ALL_SELECTED) {
          yColumns.push({ label: o.value, value: getYColumnValue(o.value) });
        }
      });
    }
    return yColumns;
  }
);

const getBarChartData = createSelector(
  [ getFundOptions, getFilteredData, getYColumns, getDataSelected ],
  (options, filteredData, yColumns, dataSelected) => {
    if (!filteredData || isEmpty(filteredData)) return null;
    const yearValues = uniq(filteredData.map(d => d.year));
    const parsedData = [];
    yearValues.forEach(x => {
      const yItems = {};
      filteredData.forEach(d => {
        if (d.year === x && (d.value || d.value === 0)) {
          yItems[getYColumnValue(d.source)] = d.value;
        }
      });
      const item = { x: parseInt(x, 10), ...yItems };
      if (!isEmpty({ ...yItems })) parsedData.push(item);
    });

    return {
      data: parsedData,
      domain: getDomain(),
      config: {
        axes: {
          xBottom: { name: 'Year', unit: '', format: 'date' },
          yLeft: {
            name: 'USD million',
            unit: 'USD million',
            format: 'string',
            label: { dy: 10, className: '' }
          }
        },
        tooltip: getTooltipConfig(yColumns),
        animation: false,
        columns: {
          x: getXColumn(),
          y: yColumns.map(c => ({ ...c, stackId: 'stack1' }))
        },
        theme: getThemeConfig(yColumns),
        yLabelFormat: value => format('.2s')(value).replace('G', 'B')
      },
      dataOptions: options,
      dataSelected
    };
  }
);

export const getClimateFinance = createStructuredSelector({
  chartData: getBarChartData,
  query: getQuery,
  fundOptions: getFundOptions,
  selectedFund: getSelectedOption,
  loading: getLoading
});

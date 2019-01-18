import { createStructuredSelector, createSelector } from 'reselect';
import { format } from 'd3-format';

export const getQuery = ({ location }) => location && location.query || null;

export const getIndicators = ({ indicators }) => indicators && indicators.data;
export const getLoading = ({ indicators }) => !indicators;
export const getFirstChartFilter = (queryName, selectedOptions) => {
  const label = selectedOptions[queryName] && selectedOptions[queryName].label;

  return [ { label } ];
};

export const getDomain = () => ({ x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] });

export const getAxes = (xName, yName) => ({
  xBottom: { name: xName, unit: '', format: 'string' },
  yLeft: { name: yName, unit: '', format: 'number' }
});

export const getXColumn = () => [ { label: 'year', value: 'x' } ];

export const getTheme = color => ({ y: { stroke: color, fill: color } });

const getFundOptions = createSelector([ getIndicators ], indicators => {
  if (!indicators) return null;
  const options = [];
  return options;
});

const getSelectedOption = createSelector([ getFundOptions, getQuery ], (
  options,
  query
) =>
  {
    if (!options) return null;
    if (!query) return options[0];
    return options[0];
  });

const getBarChartData = createSelector(
  [ getIndicators, getFundOptions, getSelectedOption ],
  (data, options, selectedOption) => {
    if (!data) return null;

    return {
      data,
      domain: getDomain(),
      config: {
        axes: getAxes('Year', 'People'),
        tooltip: {
          y: {
            label: 'People',
            format: value => `${format(',.4s')(`${value}`).replace('G', 'B')}`
          },
          x: { label: 'Year' },
          indicator: 'People'
        },
        animation: false,
        columns: { x: getXColumn(), y: [ { label: 'People', value: 'y' } ] },
        theme: getTheme('#2EC9DF'),
        yLabelFormat: value => `${format('.2s')(`${value}`).replace('G', 'B')}`
      },
      dataOptions: options,
      dataSelected: selectedOption
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

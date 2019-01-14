import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';

const { COUNTRY_ISO } = process.env;

export const getQuery = ({ location }) => location && location.query || null;

export const getIndicators = ({ indicators }) => indicators && indicators.data;

export const getNationalIndicators = createSelector(
  [ getIndicators ],
  nationalIndicators => {
    if (!nationalIndicators || isEmpty(nationalIndicators)) return null;
    return nationalIndicators.values &&
      nationalIndicators.values.filter(
        ind => ind.location_iso_code3 === COUNTRY_ISO
      );
  }
);

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

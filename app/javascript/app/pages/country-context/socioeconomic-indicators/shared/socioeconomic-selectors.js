import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';

const { COUNTRY_ISO } = process.env;

export const getQuery = ({ location }) => (location && location.query) || null;

export const getIndicators = ({ indicators }) => indicators && indicators.data;
export const getLoading = ({ indicators }) => !indicators;

export const getNationalIndicators = createSelector(
  [getIndicators],
  indicators => {
    if (!indicators || isEmpty(indicators)) return null;
    return (
      indicators.values &&
      indicators.values.filter(ind => ind.location_iso_code3 === COUNTRY_ISO)
    );
  }
);

export const getProvincesIndicators = createSelector(
  [getIndicators],
  indicators => {
    if (!indicators || isEmpty(indicators)) return null;
    return (
      indicators.values &&
      indicators.values.filter(ind => ind.location_iso_code3 !== COUNTRY_ISO)
    );
  }
);

export const getIndicatorsMetadata = createSelector(
  getIndicators,
  indicators => {
    if (!indicators || isEmpty(indicators)) return null;
    return indicators.indicators;
  }
);

export const getIndicatorsValues = createSelector(
  getIndicators,
  indicators => {
    if (!indicators || isEmpty(indicators)) return null;
    return indicators.values;
  }
);

export const getFirstChartFilter = (queryName, selectedOptions) => {
  const label = selectedOptions[queryName] && selectedOptions[queryName].label;

  return [{ label }];
};

export const getDomain = () => ({ x: ['auto', 'auto'], y: [0, 'auto'] });

export const getAxes = (xBottom, yLeft) => ({
  xBottom: { unit: '', format: 'string', ...xBottom },
  yLeft: { unit: '', format: 'number', ...yLeft }
});

export const getXColumn = () => [{ label: 'year', value: 'x' }];

export const getTheme = color => ({ y: { stroke: color, fill: color } });

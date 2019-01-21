import { createAction, createThunkAction } from 'redux-tools';
import isEmpty from 'lodash/isEmpty';
import { ESPAPI } from 'services/api';

const getEspLocationsInit = createAction('getEspLocationsInit');
const getEspLocationsReady = createAction('getEspLocationsReady');
const getEspLocationsWithScenarioReady = createAction(
  'getEspLocationsWithScenarioReady'
);
const getEspLocationsFail = createAction('getEspLocationsFail');

const getEspLocations = createThunkAction('getEspLocations', (
  { withTimeSeries, scenarioId }
) =>
  (dispatch, state) => {
    const { espLocations } = state();
    if (
      espLocations.data &&
        isEmpty(espLocations.data) &&
        !espLocations.loading ||
        scenarioId &&
          espLocations.scenarios &&
          !espLocations.scenarios[scenarioId] ||
        espLocations.error
    ) {
      dispatch(getEspLocationsInit());
      const scenarioParam = scenarioId ? { scenario: scenarioId } : {};
      const withTimeSeriesParam = withTimeSeries && !scenarioId
        ? { time_series: true }
        : {};
      ESPAPI
        .get('locations', { ...withTimeSeriesParam, ...scenarioParam })
        .then(data => {
          if (data) {
            if (scenarioId) {
              dispatch(getEspLocationsWithScenarioReady({ data, scenarioId }));
            } else {
              dispatch(getEspLocationsReady(data));
            }
          } else {
            dispatch(getEspLocationsReady({}));
          }
        })
        .catch(error => {
          console.warn(error);
          dispatch(getEspLocationsFail());
        });
    }
  });

export default {
  getEspLocations,
  getEspLocationsInit,
  getEspLocationsReady,
  getEspLocationsWithScenarioReady,
  getEspLocationsFail
};

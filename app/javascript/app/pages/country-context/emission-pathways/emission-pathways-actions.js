import { createAction, createThunkAction } from 'redux-tools';
import isEmpty from 'lodash/isEmpty';
import { ESPAPI } from 'services/api';
import { COUNTRY_CONTEXT } from 'router';

const updateFiltersSelected = createAction(COUNTRY_CONTEXT);

const findAvailableModelsInit = createAction('findAvailableModelsInit');
const findAvailableModelsReady = createAction('findAvailableModelsReady');
const findAvailableModelsFail = createAction('findAvailableModelsFail');

const findAvailableModels = createThunkAction(
  'findAvailableModels',
  locationId => (dispatch, state) => {
    const { espGraph } = state();
    if (isEmpty(espGraph.locations) || !espGraph.locations[locationId]) {
      dispatch(findAvailableModelsInit());
      ESPAPI
        .get('models', { location: locationId, time_series: true })
        .then(data => {
          if (data) {
            dispatch(
              findAvailableModelsReady({
                locationId,
                modelIds: data.map(d => d.id)
              })
            );
          } else {
            dispatch(findAvailableModelsReady({ locationId, modelIds: {} }));
          }
        })
        .catch(error => {
          console.warn(error);
          dispatch(findAvailableModelsFail());
        });
    }
  }
);

export default {
  findAvailableModels,
  findAvailableModelsInit,
  findAvailableModelsReady,
  findAvailableModelsFail,
  updateFiltersSelected
};

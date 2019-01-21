import { createAction, createThunkAction } from 'redux-tools';
import isEmpty from 'lodash/isEmpty';
import { ESPAPI } from 'services/api';

const fetchEspModelsInit = createAction('fetchEspModelsInit');
const fetchEspModelsReady = createAction('fetchEspModelsReady');
const fetchEspModelsFail = createAction('fetchEspModelsFail');

const fetchEspModels = createThunkAction('fetchEspModels', () =>
  (dispatch, state) => {
    const { espModels } = state();
    if (espModels.data && isEmpty(espModels.data) && !espModels.loading) {
      dispatch(fetchEspModelsInit());
      ESPAPI
        .get('models')
        .then(data => {
          if (data) {
            dispatch(fetchEspModelsReady(data));
          } else {
            dispatch(fetchEspModelsReady({}));
          }
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchEspModelsFail());
        });
    }
  });

export default {
  fetchEspModels,
  fetchEspModelsInit,
  fetchEspModelsReady,
  fetchEspModelsFail
};

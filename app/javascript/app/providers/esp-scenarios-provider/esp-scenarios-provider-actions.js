import { createAction, createThunkAction } from 'redux-tools';
import isEmpty from 'lodash/isEmpty';
import { ESPAPI } from 'services/api';

export const fetchEspScenariosInit = createAction('fetchEspScenariosInit');
export const fetchEspScenariosReady = createAction('fetchEspScenariosReady');
export const fetchEspScenariosFail = createAction('fetchEspScenariosFail');

export const fetchEspScenarios = createThunkAction('fetchEspScenarios', () =>
  (dispatch, state) => {
    const { espScenarios } = state();
    if (
      espScenarios.data && isEmpty(espScenarios.data) && !espScenarios.loading
    ) {
      dispatch(fetchEspScenariosInit());
      ESPAPI
        .get('scenarios')
        .then(data => {
          if (data) {
            dispatch(fetchEspScenariosReady(data));
          } else {
            dispatch(fetchEspScenariosReady({}));
          }
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchEspScenariosFail());
        });
    }
  });

export default {
  fetchEspScenarios,
  fetchEspScenariosInit,
  fetchEspScenariosReady,
  fetchEspScenariosFail
};

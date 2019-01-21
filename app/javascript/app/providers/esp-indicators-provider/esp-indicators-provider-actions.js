import { createAction, createThunkAction } from 'redux-tools';
import upperFirst from 'lodash/upperFirst';
import isEmpty from 'lodash/isEmpty';
import { ESPAPI } from 'services/api';

const fetchEspIndicatorsInit = createAction('fetchEspIndicatorsInit');
const fetchEspIndicatorsReady = createAction('fetchEspIndicatorsReady');
const fetchEspIndicatorsFail = createAction('fetchEspIndicatorsFail');

const fetchEspIndicators = createThunkAction('fetchEspIndicators', () =>
  (dispatch, state) => {
    const { espIndicators } = state();
    if (
      espIndicators.data &&
        isEmpty(espIndicators.data) &&
        !espIndicators.loading
    ) {
      dispatch(fetchEspIndicatorsInit());
      ESPAPI
        .get('indicators')
        .then(data => {
          if (data) {
            const dataParsed = data.map(d => ({
              ...d,
              name: upperFirst(d.name)
            }));
            dispatch(fetchEspIndicatorsReady(dataParsed));
          } else {
            dispatch(fetchEspIndicatorsReady({}));
          }
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchEspIndicatorsFail());
        });
    }
  });

export default {
  fetchEspIndicators,
  fetchEspIndicatorsInit,
  fetchEspIndicatorsReady,
  fetchEspIndicatorsFail
};

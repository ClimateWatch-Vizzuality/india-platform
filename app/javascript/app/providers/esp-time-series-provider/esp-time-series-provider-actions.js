import { createAction, createThunkAction } from 'redux-tools';
import { ESPAPI } from 'services/api';

const getEspTimeSeriesInit = createAction('getEspTimeSeriesInit');
const getEspLocationsFail = createAction('getEspLocationsFail');
const getEspTimeSeriesReady = createAction('getEspTimeSeriesReady');

const getEspTimeSeries = createThunkAction('getEspTimeSeries', (
  { location, model }
) =>
  (dispatch, state) => {
    const { espTimeSeries } = state();
    if (espTimeSeries && !espTimeSeries.loading) {
      dispatch(getEspTimeSeriesInit());
      const query = { location, model };

      ESPAPI
        .get('time_series_values', query)
        .then(data => {
          dispatch(getEspTimeSeriesReady(data));
        })
        .catch(error => {
          console.info(error);
          dispatch(getEspLocationsFail());
        });
    }
  });

export default {
  getEspTimeSeries,
  getEspTimeSeriesInit,
  getEspTimeSeriesReady
};

import actions from './esp-time-series-provider-actions';

export const initialState = {
  error: false,
  loaded: false,
  loading: false,
  data: {}
};

const setLoading = (loading, state) => ({ ...state, loading });
const setLoaded = (loaded, state) => ({ ...state, loaded });
const setError = (error, state) => ({ ...state, error });

export default {
  [actions.getEspTimeSeriesInit]: state => setLoading(true, state),
  [actions.getEspTimeSeriesReady]: (state, { payload }) =>
    setError(
      false,
      setLoaded(true, setLoading(false, { ...state, data: payload }))
    ),
  [actions.getEspTimeSeriesFail]: state =>
    setError(true, setLoading(false, setLoaded(true, { ...state })))
};

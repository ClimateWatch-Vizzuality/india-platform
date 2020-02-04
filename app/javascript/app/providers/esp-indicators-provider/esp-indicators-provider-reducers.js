import actions from './esp-indicators-provider-actions';

export const initialState = {
  loading: false,
  error: false,
  loaded: false,
  data: {}
};

const setLoading = (loading, state) => ({ ...state, loading });
const setLoaded = (loaded, state) => ({ ...state, loaded });
const setError = (error, state) => ({ ...state, error });

export default {
  [actions.fetchEspIndicatorsInit]: state => setLoading(true, state),
  [actions.fetchEspIndicatorsReady]: (state, { payload }) =>
    setError(
      false,
      setLoaded(true, setLoading(false, { ...state, data: payload }))
    ),
  [actions.fetchEspIndicatorsFail]: state => {
    setError(true, setLoading(false, setLoaded(true, { ...state })));
  }
};

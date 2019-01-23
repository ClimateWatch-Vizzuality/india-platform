import actions from './esp-models-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  error: false,
  data: {}
};

const setError = (error, state) => ({ ...state, error });
const setLoading = (loading, state) => ({ ...state, loading });
const setLoaded = (loaded, state) => ({ ...state, loaded });

export default {
  [actions.fetchEspModelsInit]: state => setLoading(true, state),
  [actions.fetchEspModelsReady]: (state, { payload }) =>
    setError(
      false,
      setLoaded(true, setLoading(false, { ...state, data: payload }))
    ),
  [actions.fetchEspModelsFail]: state =>
    setError(true, setLoading(false, setLoaded(true, { ...state })))
};

import actions from './emission-pathways-actions';

export const initialState = {
  loading: false,
  error: false,
  loaded: false,
  locations: {}
};

const setLoading = (loading, state) => ({ ...state, loading });
const setLoaded = (loaded, state) => ({ ...state, loaded });
const setError = (error, state) => ({ ...state, error });

export default {
  [actions.findAvailableModelsInit]: state => setLoading(true, state),
  [actions.findAvailableModelsReady]: (state, { payload }) =>
    setError(
      false,
      setLoaded(
        true,
        setLoading(false, {
          ...state,
          locations: {
            ...state.locations,
            [payload.locationId]: payload.modelIds
          }
        })
      )
    ),
  [actions.findAvailableModelsFail]: state => {
    setLoading(false, { ...state });
    setError(true, { ...state });
  }
};

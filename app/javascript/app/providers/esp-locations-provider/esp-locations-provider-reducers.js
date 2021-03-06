import actions from './esp-locations-provider-actions';

export const initialState = {
  loading: false,
  error: false,
  loaded: false,
  data: {},
  scenarios: {}
};

const setLoading = (loading, state) => ({ ...state, loading });
const setLoaded = (loaded, state) => ({ ...state, loaded });
const setError = (error, state) => ({ ...state, error });

export default {
  [actions.getEspLocationsInit]: state => setLoading(true, state),
  [actions.getEspLocationsReady]: (state, { payload }) =>
    setError(
      false,
      setLoaded(true, setLoading(false, { ...state, data: payload }))
    ),
  [actions.getEspLocationsWithScenarioReady]: (state, { payload }) =>
    setError(
      false,
      setLoaded(
        true,
        setLoading(false, {
          ...state,
          scenarios: { ...state.scenarios, [payload.scenarioId]: payload.data }
        })
      )
    ),
  [actions.getEspLocationsFail]: state =>
    setError(true, setLoading(false, setLoaded(true, { ...state })))
};

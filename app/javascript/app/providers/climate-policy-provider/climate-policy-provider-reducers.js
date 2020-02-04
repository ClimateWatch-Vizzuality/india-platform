import * as actions from './climate-policy-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchClimatePolicyInit]: state => ({ ...state, loading: true }),
  [actions.fetchClimatePolicyReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: { ...state.data, [payload.code]: payload }
  }),
  [actions.fetchClimatePolicyFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};

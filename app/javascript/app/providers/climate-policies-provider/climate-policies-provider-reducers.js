import * as actions from './climate-policies-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchClimatePoliciesInit]: state => ({ ...state, loading: true }),
  [actions.fetchClimatePoliciesReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchClimatePoliciesFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};

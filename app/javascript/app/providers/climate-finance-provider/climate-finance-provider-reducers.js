import * as actions from './climate-finance-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchClimateFinanceInit]: state => ({ ...state, loading: true }),
  [actions.fetchClimateFinanceReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchClimateFinanceFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};

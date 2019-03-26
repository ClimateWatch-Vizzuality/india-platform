import * as actions from './stories-actions';

export const initialState = {
  loading: false,
  loaded: false,
  error: false,
  data: []
};

export default {
  [actions.fetchStoriesInit]: state => ({ ...state, loading: true }),
  [actions.fetchStoriesReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchStoriesFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};

import { createAction, createThunkAction } from 'redux-tools';
import { CWAPI } from 'services/api';

export const fetchStoriesInit = createAction('fetchStoriesInit');
export const fetchStoriesReady = createAction('fetchStoriesReady');
export const fetchStoriesFail = createAction('fetchStoriesFail');

const params = { tags: 'indiaclimatedata' /** , limit: 3 */ };

export const fetchStories = createThunkAction(
  'fetchStories',
  () => (dispatch, state) => {
    const { stories } = state();
    if (!stories.loading) {
      dispatch(fetchStoriesInit());
      CWAPI.get('stories', params)
        .then((data = []) => {
          dispatch(fetchStoriesReady(data));
        })
        .catch(error => {
          console.info(error);
          dispatch(fetchStoriesFail(error));
        });
    }
  }
);

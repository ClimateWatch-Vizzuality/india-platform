import { createSelector } from 'reselect';

const DATA_TAG = 'indiaclimatedata';

const getStories = state => (state.stories && state.stories.data) || null;

export const getStoriesForIndia = createSelector(
  [getStories],
  data => {
    if (!data || !data.length) return null;
    return data.filter(({ tags }) => tags.includes(DATA_TAG)).slice(0, 3);
  }
);

import { createSelector, createStructuredSelector } from 'reselect';
import { isArray } from 'lodash';

const getQuery = ({ location }) => location && (location.query || null);

export const getFilters = createSelector(getQuery, query => {
  if (!query) return null;
  return Object
    .keys(query)
    .reduce(
      (acc, key) =>
        isArray(query[key])
          ? { ...acc, [key]: query[key] }
          : { ...acc, [key]: [ query[key] ] },
      {}
    );
});

export const searchSelectors = createStructuredSelector({
  query: getQuery,
  filters: getFilters
});

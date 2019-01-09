import { createSelector, createStructuredSelector } from 'reselect';
import { isArray, isEmpty } from 'lodash';

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

export const getPlainFilters = createSelector(getQuery, query => {
  if (!query) return null;
  const { description, ...rest } = query;
  if (isEmpty(rest)) return null;
  return Object
    .keys(rest)
    .reduce(
      (acc, key) =>
        isArray(query[key])
          ? [ ...acc, ...query[key] ]
          : [ ...acc, query[key] ],
      []
    );
});

export const getDescription = createSelector(getQuery, query => {
  if (!query) return null;
  const { description } = query;
  if (!description) return null;
  return description;
});

export const searchSelectors = createStructuredSelector({
  query: getQuery,
  foldedFilters: getFilters,
  plainFilters: getPlainFilters,
  description: getDescription
});

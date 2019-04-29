import { createSelector } from 'reselect';
import flatMap from 'lodash/flatMap';

export const getMetadata = ({ metadata }) =>
  (metadata && metadata.ghg && metadata.ghg.data) || null;
export const getEmissionsData = ({ GHGEmissions }) => (GHGEmissions && GHGEmissions.data) || null;
export const getQuery = ({ location }) => (location && location.query) || null;
export const getSources = createSelector(
  [getMetadata],
  meta => {
    if (!meta) return [];
    return flatMap(meta.dataSource, s => s.name.split(',')).map(s => s.trim());
  }
);

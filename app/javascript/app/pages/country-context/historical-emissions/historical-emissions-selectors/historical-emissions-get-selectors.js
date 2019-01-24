export const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data || null;
export const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data || null;
export const getQuery = ({ location }) => location && location.query || null;

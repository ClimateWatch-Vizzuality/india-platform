import { createStructuredSelector, createSelector } from 'reselect';

import { getClimatePoliciesList, getPoliciesListBySector, getSectors, getResponsibleAuthorities } from 'selectors/climate-policies-selectors';


const getQuery = ({ location }) => location && (location.query || null);

export const climatePolicies = createStructuredSelector({
  query: getQuery,
  policiesList: getClimatePoliciesList,
  policiesListBySector: getPoliciesListBySector,
  sectors: getSectors,
  authorities: getResponsibleAuthorities
});
import { createSelector, createStructuredSelector } from 'reselect';
import { groupBy } from 'lodash';

export const getClimatePoliciesList = ({ ClimatePolicies }) =>
  ClimatePolicies && (ClimatePolicies.data || null);

export const getPolicyCode = ({ location }) =>
  location && location.payload && location.payload.policy;

export const getPoliciesListBySector = createSelector(
  getClimatePoliciesList,
  list => {
    if (!list) return null;
    return groupBy(list, 'sector');
  }
);

export const getSectors = createSelector(
  getPoliciesListBySector,
  policiesBySector => {
    if (!policiesBySector) return null;
    return Object.keys(policiesBySector);
  }
);

export const getResponsibleAuthorities = createSelector(
  getClimatePoliciesList,
  list => {
    if (!list) return null;
    return Object.keys(groupBy(list, 'authority'));
  }
);
export const policiesByCode = createSelector(getClimatePoliciesList, list => {
  if (!list) return null;
  const groupedByCode = groupBy(list, 'code');
  return Object
    .keys(groupedByCode)
    .reduce((acc, code) => ({ ...acc, [code]: groupedByCode[code][0] }), {});
});

export const climatePolicies = createStructuredSelector({
  policiesList: getClimatePoliciesList,
  policiesListBySector: getPoliciesListBySector,
  policiesByCode,
  policyCode: getPolicyCode
});

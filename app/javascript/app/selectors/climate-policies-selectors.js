import { createSelector } from 'reselect';
import { groupBy } from 'lodash';

export const getClimatePoliciesList = ({ ClimatePolicies }) =>
  ClimatePolicies && (ClimatePolicies.data || null);

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
    return Object.keys(policiesBySector)
  }
)

export const getResponsibleAuthorities = createSelector(
  getClimatePoliciesList,
  list => {
    if (!list) return null;
    return Object.keys(groupBy(list, 'authority'));
  }
)

import { createStructuredSelector, createSelector } from 'reselect';
import { isEmpty, groupBy, castArray } from 'lodash';

import {
  getClimatePoliciesList,
  getSectors,
  getResponsibleAuthorities
} from 'selectors/climate-policies-selectors';

const getQuery = ({ location }) => location && (location.query || null);

const getFilteredPolicies = createSelector(
  [getQuery, getClimatePoliciesList],
  (query, policies) => {
    if (!policies || isEmpty(policies)) return null;
    if (!query || isEmpty(query)) return policies;
    const filtersFieldsArray = Object.keys(query).filter(
      f => !isEmpty(query[f])
    );
    const x = policies.reduce((acc, policy) => {
      const notFiltered = filtersFieldsArray.filter(f =>
        castArray(query[f]).some(q => policy[f].toLowerCase().includes(q.toLowerCase())));
      const fullyMatch = filtersFieldsArray.every(filter =>
        notFiltered.includes(filter));
      return fullyMatch ? [...acc, policy] : [...acc];
    }, []);
    return x;
  }
);

const getFilteredPoliciesBySector = createSelector(
  getFilteredPolicies,
  policies => {
    if (!policies) return null;
    return groupBy(policies, 'sector');
  }
);

const getKeyClimatePolicies = createSelector(
  getFilteredPolicies,
  policies => {
    if (!policies) return null;
    return policies
      .filter(({ key_policy }) => key_policy)
      .map(({ title, status, progress }) => ({
        policy: title,
        policy_status: status,
        policy_progress: progress
      }));
  }
);

export const climatePolicies = createStructuredSelector({
  query: getQuery,
  policiesList: getFilteredPolicies,
  policiesListBySector: getFilteredPoliciesBySector,
  sectors: getSectors,
  authorities: getResponsibleAuthorities,
  keyPoliciesList: getKeyClimatePolicies
});

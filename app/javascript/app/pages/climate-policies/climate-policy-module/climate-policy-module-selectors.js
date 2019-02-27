import { createStructuredSelector, createSelector } from 'reselect';
import { isEmpty, groupBy, isArray } from 'lodash';

import {
  getClimatePoliciesList,
  getSectors,
  getResponsibleAuthorities
} from 'selectors/climate-policies-selectors';

const getQuery = ({ location }) => location && (location.query || null);

const getFilteredPolicies = createSelector(
  [ getQuery, getClimatePoliciesList ],
  (query, policies) => {
    if (!policies || isEmpty(policies)) return null;
    if (!query || isEmpty(query)) return policies;
    const filtersFieldsArray = Object
      .keys(query)
      .filter(f => !isEmpty(query[f]));
    return policies.reduce(
      (acc, policy) => {
        const notFiltered = filtersFieldsArray.find(
          f =>
            isArray(query[f])
              ? query[f].includes(policy[f])
              : policy[f].includes(query[f])
        );
        return notFiltered ? [ ...acc, policy ] : [ ...acc ];
      },
      []
    );
  }
);

const getFilteredPoliciesBySector = createSelector(
  getFilteredPolicies,
  policies => {
    if (!policies) return null;
    return groupBy(policies, 'sector');
  }
);

const getKeyClimatePolicies = createSelector(getFilteredPolicies, policies => {
  if (!policies) return null;
  return policies
    .filter(({ key_policy }) => key_policy)
    .map(({ title, status, progress }) => ({
      policy: title,
      policy_status: status,
      policy_progress: progress
    }));
});

export const climatePolicies = createStructuredSelector({
  query: getQuery,
  policiesList: getFilteredPolicies,
  policiesListBySector: getFilteredPoliciesBySector,
  sectors: getSectors,
  authorities: getResponsibleAuthorities,
  keyPoliciesList: getKeyClimatePolicies
});

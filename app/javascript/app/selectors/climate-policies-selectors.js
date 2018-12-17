import { createSelector, createStructuredSelector } from 'reselect';
import { groupBy } from 'lodash';

export const getClimatePoliciesList = ({ ClimatePolicies }) =>
  ClimatePolicies && (ClimatePolicies.data || null);

export const getPolicyCode = ({ location }) =>
  location && location.payload && location.payload.policy;

export const getClimatePoliciesDetails = ({ ClimatePoliciesDetails }) =>
  ClimatePoliciesDetails && (ClimatePoliciesDetails.data || null);

export const getClimatePolicyDetails = createSelector(
  [ getClimatePoliciesDetails, getPolicyCode ],
  (climatePoliciesDetails, policyCode) => {
    if (!climatePoliciesDetails || !policyCode) return null;

    return climatePoliciesDetails[policyCode];
  }
);

export const getInstruments = createSelector(
  [ getClimatePolicyDetails ],
  policyDetails => {
    if (!policyDetails) return null;

    const instruments = policyDetails && policyDetails.instruments;
    return instruments.map(instrument => ({
      ...instrument,
      slug: instrument.code
    }));
  }
);

export const policiesListBySector = createSelector(
  getClimatePoliciesList,
  list => {
    if (!list) return null;
    return groupBy(list, 'sector');
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
  policiesListBySector,
  policiesByCode,
  policyCode: getPolicyCode,
  policyDetails: getClimatePolicyDetails,
  instruments: getInstruments
});

import { createSelector, createStructuredSelector } from 'reselect';
import { flatMap, groupBy, uniq, sortBy } from 'lodash';

export const getClimatePoliciesList = ({ ClimatePolicies }) =>
  ClimatePolicies && (ClimatePolicies.data || null);

export const getPolicyCode = ({ location }) =>
  location && location.payload && location.payload.policy;

export const getClimatePoliciesDetails = ({ ClimatePoliciesDetails }) =>
  ClimatePoliciesDetails && (ClimatePoliciesDetails.data || null);

export const getClimatePolicyDetails = createSelector(
  [getClimatePoliciesDetails, getPolicyCode],
  (climatePoliciesDetails, policyCode) => {
    if (!climatePoliciesDetails || !policyCode) return null;
    return climatePoliciesDetails[policyCode];
  }
);

export const getIndicators = createSelector(
  [getClimatePolicyDetails],
  policyDetails => {
    if (!policyDetails) return null;

    const indicators = policyDetails && policyDetails.indicators;
    const sluggedIndicators = indicators.map(indicator => ({
      ...indicator,
      slug: indicator.title
    }));

    const groupedByCategory = groupBy(sluggedIndicators, 'category');

    return Object.keys(groupedByCategory).map(cat => ({
      slug: cat,
      title: cat,
      content: groupedByCategory[cat]
    }));
  }
);

export const getSources = createSelector(
  [getClimatePolicyDetails],
  policyDetails => {
    if (!policyDetails) return null;
    return policyDetails && policyDetails.sources;
  }
);

export const getInstruments = createSelector(
  [getClimatePolicyDetails],
  policyDetails => {
    if (!policyDetails) return null;
    const instruments = policyDetails && policyDetails.instruments.reverse();
    return instruments.map(instrument => ({
      ...instrument,
      slug: instrument.title
    }));
  }
);

export const getMilestones = createSelector(
  [getClimatePolicyDetails],
  policyDetails => {
    if (!policyDetails) return null;
    const milestones = policyDetails && policyDetails.milestones;
    return milestones;
  }
);

export const getIndicatorsProgress = createSelector(
  [getClimatePolicyDetails, getPolicyCode, getSources],
  (policyDetails, policyCode, sources) => {
    if (!policyDetails || !policyCode || !sources) return null;

    const indicators =
      policyDetails &&
      policyDetails.indicators.filter(i => !!i.progress_display);
    const sortedIndicators =
      policyCode === 'CEC' ? sortBy(indicators, ['title']) : indicators;

    const indicatorsWithSoures = sortedIndicators.map(indicator => {
      const filteredSources = sources.filter(({ id }) =>
        indicator.source_ids.includes(id));
      const sourcesModalData = filteredSources.map(
        ({ code, name, description, link }) => ({
          code,
          name,
          description,
          link
        })
      );
      const infoModalData = {
        data: sourcesModalData,
        title: 'Sources',
        tabTitles: filteredSources.map(({ code }) => code)
      };
      return { ...indicator, infoModalData };
    });
    return indicatorsWithSoures;
  }
);

export const getPoliciesListBySector = createSelector(
  // export const policiesListBySector = createSelector(
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

    return uniq(
      flatMap(list, p =>
        (p.authority || '')
          .replace(', and', ',')
          .split(',')
          .map(a => a.trim()))
    ).sort();
  }
);
export const policiesByCode = createSelector(
  getClimatePoliciesList,
  list => {
    if (!list) return null;
    const groupedByCode = groupBy(list, 'code');
    return Object.keys(groupedByCode).reduce(
      (acc, code) => ({ ...acc, [code]: groupedByCode[code][0] }),
      {}
    );
  }
);

export const climatePolicies = createStructuredSelector({
  policiesList: getClimatePoliciesList,
  policiesListBySector: getPoliciesListBySector,
  policiesByCode,
  policyCode: getPolicyCode,
  policyDetails: getClimatePolicyDetails,
  instruments: getInstruments,
  milestones: getMilestones,
  indicators: getIndicators,
  indicatorsProgress: getIndicatorsProgress,
  sources: getSources
});

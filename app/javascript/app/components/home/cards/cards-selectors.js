import { createSelector, createStructuredSelector } from 'reselect';

const getCountryOverviewData = ({ countriesOverviewData }) =>
  countriesOverviewData.data ? countriesOverviewData.data.values : null;
export const parseCardsData = createSelector(
  getCountryOverviewData,
  overview => overview && overview
      .map(o => ({ title: o.name, description: o.value }))
      .filter((i, index) => index !== 1)
);
export const getCardsData = createStructuredSelector({
  cardsData: parseCardsData
});

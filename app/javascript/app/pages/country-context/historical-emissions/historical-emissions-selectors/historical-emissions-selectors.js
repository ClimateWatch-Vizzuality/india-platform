import { createStructuredSelector } from 'reselect';
import { getQuery } from './historical-emissions-get-selectors';
import {
  getSelectedOptions,
  getFilterOptions,
  getAllSelectedOption
} from './historical-emissions-filter-selectors';
import { getEmissionParams } from './historical-emissions-fetch-selectors';
import { getChartData } from './historical-emissions-data-selectors';

export const getGHGEmissions = createStructuredSelector({
  selectedOptions: getSelectedOptions,
  filterOptions: getFilterOptions,
  query: getQuery,
  emissionParams: getEmissionParams,
  chartData: getChartData,
  allSelectedOption: getAllSelectedOption
});

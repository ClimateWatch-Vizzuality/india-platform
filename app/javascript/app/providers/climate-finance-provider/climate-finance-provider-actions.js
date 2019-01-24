import { createAction, createThunkAction } from 'redux-tools';
import { INDIAAPI } from 'services/api';

export const fetchClimateFinanceInit = createAction('fetchClimateFinanceInit');
export const fetchClimateFinanceReady = createAction(
  'fetchClimateFinanceReady'
);
export const fetchClimateFinanceFail = createAction('fetchClimateFinanceFail');

export const fetchClimateFinance = createThunkAction(
  'fetchClimateFinance',
  params => (dispatch, state) => {
    const { climateFinance } = state();
    if (!climateFinance.loading) {
      dispatch(fetchClimateFinanceInit());
      INDIAAPI
        .get('climate_finance', params)
        .then((data = {}) => {
          dispatch(fetchClimateFinanceReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchClimateFinanceFail(error && error.message));
        });
    }
  }
);

import { createAction, createThunkAction } from 'redux-tools';
import { INDIAAPI } from 'services/api';

export const fetchClimatePoliciesInit = createAction(
  'fetchClimatePoliciesInit'
);
export const fetchClimatePoliciesReady = createAction(
  'fetchClimatePoliciesReady'
);
export const fetchClimatePoliciesFail = createAction(
  'fetchClimatePoliciesFail'
);

export const fetchClimatePolicies = createThunkAction(
  'fetchClimatePolicies',
  params => (dispatch, state) => {
    const { ClimatePolicies } = state();
    if (!ClimatePolicies.loading) {
      dispatch(fetchClimatePoliciesInit());
      INDIAAPI
        .get('climate_policy/policies', params)
        .then((data = {}) => {
          dispatch(fetchClimatePoliciesReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchClimatePoliciesFail(error && error.message));
        });
    }
  }
);

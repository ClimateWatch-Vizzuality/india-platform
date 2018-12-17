import { createAction, createThunkAction } from 'redux-tools';
import isEmpty from 'lodash/isEmpty';
import { INDIAAPI } from 'services/api';

export const fetchClimatePolicyInit = createAction('fetchClimatePolicyInit');
export const fetchClimatePolicyReady = createAction('fetchClimatePolicyReady');
export const fetchClimatePolicyFail = createAction('fetchClimatePolicyFail');

export const fetchClimatePolicy = createThunkAction('fetchClimatePolicy', (
  { policyCode }
) =>
  (dispatch, state) => {
    const { ClimatePoliciesDetails } = state();
    if (
      !ClimatePoliciesDetails.loading &&
        isEmpty(ClimatePoliciesDetails.data[policyCode])
    ) {
      dispatch(fetchClimatePolicyInit());
      INDIAAPI
        .get(`climate_policy/policies/${policyCode}`)
        .then((data = {}) => {
          dispatch(fetchClimatePolicyReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchClimatePolicyFail(error && error.message));
        });
    }
  });

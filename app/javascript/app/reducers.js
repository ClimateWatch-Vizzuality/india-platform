import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';

// Providers
import {
  reduxModule as climatePolicies
} from 'providers/climate-policies-provider';
import {
  reduxModule as climatePoliciesDetails
} from 'providers/climate-policy-provider';
import { reduxModule as modalMetadata } from 'components/modal-metadata';
import {
  reduxModule as ndcContentOverview
} from 'providers/ndc-content-overview-provider';
import {
  reduxModule as ndcCountryAccordion
} from 'components/ndcs-country-accordion';

// Router
import router from './router';

const componentsReducers = {
  ndcCountryAccordion: handleModule(ndcCountryAccordion)
};

const providersReducers = {
  ClimatePolicies: handleModule(climatePolicies),
  ClimatePoliciesDetails: handleModule(climatePoliciesDetails),
  modalMetadata: handleModule(modalMetadata),
  ndcContentOverview: handleModule(ndcContentOverview)
};

export default combineReducers({
  location: router.reducer,
  ...componentsReducers,
  ...providersReducers
});

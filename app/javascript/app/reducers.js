import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';

// Providers
import {
  reduxModule as climatePolicies
} from 'providers/climate-policies-provider';
import { reduxModule as modalMetadata } from 'components/modal-metadata';

// Router
import router from './router';

const providersReducers = {
  ClimatePolicies: handleModule(climatePolicies),
  modalMetadata: handleModule(modalMetadata)
};

export default combineReducers({
  location: router.reducer,
  ...providersReducers
});

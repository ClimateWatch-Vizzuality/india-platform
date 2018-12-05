import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';

// Providers
import {
  reduxModule as climatePolicies
} from 'providers/climate-policies-provider';

// Router
import router from './router';

const providersReducers = { ClimatePolicies: handleModule(climatePolicies) };

export default combineReducers({
  location: router.reducer,
  ...providersReducers
});

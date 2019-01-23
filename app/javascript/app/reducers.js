import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';
import { reduxModule as indicators } from 'providers/indicators-provider';

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
  reduxModule as climateFinance
} from 'providers/climate-finance-provider';

// Components
import {
  reduxModule as ndcCountryAccordion
} from 'components/ndcs-country-accordion';

// Emission Pathways
import {
  reduxModule as espLocationsProvider
} from 'providers/esp-locations-provider';
import {
  reduxModule as espTimeSeriesProvider
} from 'providers/esp-time-series-provider';
import {
  reduxModule as espModelsProvider
} from 'providers/esp-models-provider';
import {
  reduxModule as espScenariosProvider
} from 'providers/esp-scenarios-provider';
import {
  reduxModule as espIndicatorsProvider
} from 'providers/esp-indicators-provider';
import {
  reduxModule as espGraphComponent
} from 'pages/country-context/emission-pathways/emission-pathways';

// Router
import router from './router';

const componentsReducers = {
  ndcCountryAccordion: handleModule(ndcCountryAccordion),
  espGraph: handleModule(espGraphComponent)
};

const providersReducers = {
  ClimatePolicies: handleModule(climatePolicies),
  ClimatePoliciesDetails: handleModule(climatePoliciesDetails),
  modalMetadata: handleModule(modalMetadata),
  ndcContentOverview: handleModule(ndcContentOverview),
  indicators: handleModule(indicators),
  climateFinance: handleModule(climateFinance),
  espModels: handleModule(espModelsProvider),
  espScenarios: handleModule(espScenariosProvider),
  espIndicators: handleModule(espIndicatorsProvider),
  espLocations: handleModule(espLocationsProvider),
  espTimeSeries: handleModule(espTimeSeriesProvider)
};

export default combineReducers({
  location: router.reducer,
  ...componentsReducers,
  ...providersReducers
});

import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';

import CountryContext from './sections/country-context';
import ClimatePolicyDetail from './sections/climate-policy-detail';

const history = createHistory();

export const HOME = 'location/HOME';
export const COUNTRY_CONTEXT = 'location/COUNTRY_CONTEXT';
export const CLIMATE_POLICIES = 'location/CLIMATE_POLICIES';
export const CLIMATE_POLICY_DETAIL = 'location/CLIMATE_POLICY_DETAIL';

export const routes = {
  [HOME]: {
    nav: false,
    label: 'Overview',
    path: '/',
    component: 'pages/home/home'
  },
  [COUNTRY_CONTEXT]: {
    nav: true,
    label: 'Country context',
    link: '/country-context',
    path: '/country-context/:section?',
    component: 'layouts/sections/sections',
    sections: CountryContext
  },
  [CLIMATE_POLICIES]: {
    nav: true,
    label: 'Climate policies',
    link: '/climate-policies',
    path: '/climate-policies',
    component: 'pages/climate-policies/climate-policy-module/climate-policy-module'
  },
  [CLIMATE_POLICY_DETAIL]: {
    nav: false,
    label: 'Climate policies',
    link: '/climate-policies',
    path: '/climate-policies/:policy?/:section?',
    component: 'layouts/sections/sections',
    sections: ClimatePolicyDetail
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch => dispatch(redirect({ type: HOME }))
  }
};

export default connectRoutes(history, routes, { querySerializer: queryString });

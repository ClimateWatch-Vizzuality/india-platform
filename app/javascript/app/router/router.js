import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';

import CountryContext from './sections/country-context';

const history = createHistory();

export const HOME = 'location/HOME';
export const COUNTRY_CONTEXT = 'location/COUNTRY_CONTEXT';
export const GHG_EMISSIONS = 'location/GHG_EMISSIONS';

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
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch => dispatch(redirect({ type: HOME }))
  }
};

export default connectRoutes(history, routes, { querySerializer: queryString });

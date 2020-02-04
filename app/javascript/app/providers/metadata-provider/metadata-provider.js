import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DataProvider from 'providers/data-provider';
import * as actions from './metadata-provider-actions';
import reducers, { initialState } from './metadata-provider-reducers';

function MetaProvider({ fetchMeta, meta }) {
  return <DataProvider fetchData={fetchMeta} params={{ meta }} />;
}

MetaProvider.propTypes = {
  meta: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]).isRequired,
  fetchMeta: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(MetaProvider);

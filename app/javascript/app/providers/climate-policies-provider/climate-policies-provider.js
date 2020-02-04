import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import * as actions from './climate-policies-provider-actions';
import reducers, { initialState } from './climate-policies-provider-reducers';

class ClimatePoliciesProvider extends PureComponent {
  componentDidMount() {
    const { fetchClimatePolicies, params } = this.props;
    fetchClimatePolicies(params);
  }

  componentDidUpdate(prevProps) {
    const { fetchClimatePolicies, params } = this.props;
    const { params: prevParams } = prevProps;
    if (!isEqual(prevParams, params)) fetchClimatePolicies(params);
  }

  render() {
    return null;
  }
}

ClimatePoliciesProvider.propTypes = {
  fetchClimatePolicies: PropTypes.func.isRequired,
  params: PropTypes.object
};

ClimatePoliciesProvider.defaultProps = { params: {} };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(ClimatePoliciesProvider);

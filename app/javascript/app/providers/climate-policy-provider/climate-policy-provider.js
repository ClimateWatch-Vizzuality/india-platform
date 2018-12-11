import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import * as actions from './climate-policy-provider-actions';
import reducers, { initialState } from './climate-policy-provider-reducers';

class ClimatePolicyProvider extends PureComponent {
  componentDidMount() {
    const { fetchClimatePolicy, params } = this.props;
    fetchClimatePolicy(params);
  }

  componentDidUpdate(prevProps) {
    const { fetchClimatePolicy, params } = this.props;
    const { params: prevParams } = prevProps;
    if (!isEqual(prevParams, params)) fetchClimatePolicy(params);
  }

  render() {
    return null;
  }
}

ClimatePolicyProvider.propTypes = {
  fetchClimatePolicy: PropTypes.func.isRequired,
  params: PropTypes.object
};

ClimatePolicyProvider.defaultProps = { params: {} };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(ClimatePolicyProvider);

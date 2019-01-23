import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import actions from './esp-scenarios-provider-actions';
import reducers, { initialState } from './esp-scenarios-provider-reducers';

class EspScenariosProvider extends PureComponent {
  componentDidMount() {
    const { fetchEspScenarios } = this.props;
    fetchEspScenarios();
  }

  render() {
    return null;
  }
}

EspScenariosProvider.propTypes = {
  fetchEspScenarios: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(EspScenariosProvider);

import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import actions from './esp-indicators-provider-actions';
import reducers, { initialState } from './esp-indicators-provider-reducers';

class EspIndicatorsProvider extends PureComponent {
  componentDidMount() {
    const { fetchEspIndicators } = this.props;
    fetchEspIndicators();
  }

  render() {
    return null;
  }
}

EspIndicatorsProvider.propTypes = {
  fetchEspIndicators: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(EspIndicatorsProvider);

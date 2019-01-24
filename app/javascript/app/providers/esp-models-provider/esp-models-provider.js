import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import actions from './esp-models-provider-actions';
import reducers, { initialState } from './esp-models-provider-reducers';

class EspModelsProvider extends PureComponent {
  componentDidMount() {
    const { fetchEspModels } = this.props;
    fetchEspModels();
  }

  render() {
    return null;
  }
}

EspModelsProvider.propTypes = { fetchEspModels: PropTypes.func.isRequired };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(EspModelsProvider);

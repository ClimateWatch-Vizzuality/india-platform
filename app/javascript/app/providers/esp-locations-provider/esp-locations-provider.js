import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import actions from './esp-locations-provider-actions';
import reducers, { initialState } from './esp-locations-provider-reducers';

class EspLocationsProvider extends PureComponent {
  componentDidMount() {
    const { withTimeSeries, scenarioId, getEspLocations } = this.props;
    getEspLocations({ withTimeSeries, scenarioId });
  }

  componentWillReceiveProps(nextProps) {
    const {
      withTimeSeries,
      scenarioId: nextScenarioId,
      getEspLocations
    } = nextProps;
    const { scenarioId } = this.props;
    if (nextScenarioId !== scenarioId) {
      getEspLocations({ withTimeSeries, scenarioId });
    }
  }

  render() {
    return null;
  }
}

EspLocationsProvider.propTypes = {
  getEspLocations: PropTypes.func.isRequired,
  withTimeSeries: PropTypes.bool,
  scenarioId: PropTypes.string
};

EspLocationsProvider.defaultProps = {
  withTimeSeries: true,
  scenarioId: undefined
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(EspLocationsProvider);

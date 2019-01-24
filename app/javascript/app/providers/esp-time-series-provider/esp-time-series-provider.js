import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import actions from './esp-time-series-provider-actions';
import reducers, { initialState } from './esp-time-series-provider-reducers';

class EspTimeSeriesProvider extends PureComponent {
  componentDidMount() {
    const { location, model, getEspTimeSeries } = this.props;
    getEspTimeSeries({ location, model });
  }

  componentWillReceiveProps(nextProps) {
    const { location, model } = this.props;
    if (nextProps.location !== location || nextProps.model !== model) {
      const {
        location: nextLocation,
        model: nextModel,
        getEspTimeSeries
      } = nextProps;
      getEspTimeSeries({ location: nextLocation, model: nextModel });
    }
  }

  render() {
    return null;
  }
}

EspTimeSeriesProvider.propTypes = {
  getEspTimeSeries: PropTypes.func.isRequired,
  location: PropTypes.number.isRequired,
  model: PropTypes.number
};

EspTimeSeriesProvider.defaultProps = { model: undefined };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(EspTimeSeriesProvider);

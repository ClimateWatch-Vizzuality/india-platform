import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import * as actions from './ndc-content-overview-provider-actions';
import reducers, {
  initialState
} from './ndc-content-overview-provider-reducers';

class NdcContentOverview extends PureComponent {
  componentDidMount() {
    const { getNdcContentOverview, params } = this.props;
    getNdcContentOverview(params);
  }

  componentDidUpdate(prevProps) {
    const { getNdcContentOverview, params } = this.props;
    const { params: prevParams } = prevProps;
    if (!isEqual(prevParams, params)) getNdcContentOverview(params);
  }

  render() {
    return null;
  }
}

NdcContentOverview.propTypes = {
  getNdcContentOverview: PropTypes.func.isRequired,
  params: PropTypes.object
};

NdcContentOverview.defaultProps = { params: {} };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(NdcContentOverview);

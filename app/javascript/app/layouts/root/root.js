import { connect } from 'react-redux';

import Component from './root-component';

const mapStateToProps = ({ location }) => ({
  route: location.routesMap[location.type],
  location: location
});

export default connect(mapStateToProps, null)(Component);

import { connect } from 'react-redux';
import { climatePolicies } from 'selectors/climate-policies-selectors';

import Component from './instruments-component';

export default connect(climatePolicies, null)(Component);

import { connect } from 'react-redux';
import { climatePolicies } from './climate-policy-module-selectors';

import Component from './climate-policy-module-component';

export default connect(climatePolicies, null)(Component);

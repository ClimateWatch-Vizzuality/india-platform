import { connect } from 'react-redux';
import { climatePolicies } from 'selectors/climate-policies-selectors';

import Component from './climate-policies-detail-header-component';

export default connect(climatePolicies, null)(Component);

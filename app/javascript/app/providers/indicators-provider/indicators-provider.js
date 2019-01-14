import { connect } from 'react-redux';

import DataProvider from 'providers/data-provider';
import * as actions from './indicators-provider-actions';
import reducers, { initialState } from './indicators-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchIndicators };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(DataProvider);

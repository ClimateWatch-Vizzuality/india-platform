import { connect } from 'react-redux';

import DataProvider from 'providers/data-provider';
import * as actions from './climate-finance-provider-actions';
import reducers, { initialState } from './climate-finance-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchClimateFinance };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(DataProvider);

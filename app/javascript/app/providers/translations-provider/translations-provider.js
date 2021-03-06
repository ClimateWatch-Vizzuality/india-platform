import { connect } from 'react-redux';

import DataProvider from 'providers/data-provider';
import * as actions from './translations-provider-actions';
import reducers, { initialState } from './translations-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchTranslations };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(DataProvider);

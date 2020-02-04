import { connect } from 'react-redux';

import DataProvider from 'providers/data-provider';
import * as actions from './stories-actions';
import reducers, { initialState } from './stories-reducers';

const mapDispatchToProps = { fetchData: actions.fetchStories };

export const reduxModule = { actions, reducers, initialState };
export default connect(
  null,
  mapDispatchToProps
)(DataProvider);

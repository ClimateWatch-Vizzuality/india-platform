import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import * as actions from './modal-metadata-actions';
import reducers, { initialState } from './modal-metadata-reducers';
import ModalMetadataComponent from './modal-metadata-component';
import {
  getModalTitle,
  getTabTitles,
  getModalData
} from './modal-metadata-selectors';

const mapStateToProps = ({ modalMetadata }, { data, title, tabTitles }) => ({
  isOpen: modalMetadata.isOpen,
  loading: modalMetadata.loading,
  title: title || getModalTitle(modalMetadata),
  tabTitles: tabTitles || getTabTitles(modalMetadata),
  data: data || getModalData(modalMetadata),
  mounted: modalMetadata.mounted
});

const includeActions = withHandlers({
  onRequestClose: ({ setModalMetadata }) => () => {
    setModalMetadata({ open: false });
  }
});

export const reduxModule = { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  includeActions(ModalMetadataComponent)
);

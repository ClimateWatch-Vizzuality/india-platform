import { connect } from 'react-redux';
import {
  setModalMetadata
} from 'components/modal-metadata/modal-metadata-actions';
import Component from './info-download-toolbox-component';

export default connect(null, { setModalMetadata })(Component);

import { connect } from 'react-redux';
import {
  setModalMetadata
} from 'components/modal-metadata/modal-metadata-actions';
import Component from './info-button-component';

const actions = { setModalMetadata };

export default connect(null, actions)(Component);

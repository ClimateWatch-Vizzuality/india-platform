import { connect } from 'react-redux';

import withTranslations from 'providers/translations-provider/with-translations.hoc';
import ComingSoonComponent from './coming-soon-component';

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  null
)(withTranslations(ComingSoonComponent));

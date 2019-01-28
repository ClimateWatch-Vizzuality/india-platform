import { connect } from 'react-redux';

import withTranslations from 'providers/translations-provider/with-translations.hoc';
import HomeComponent from './home-component';

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslations(HomeComponent));

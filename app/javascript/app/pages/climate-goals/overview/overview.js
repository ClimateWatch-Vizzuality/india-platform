import { connect } from 'react-redux';

import withTranslations from 'providers/translations-provider/with-translations.hoc';
import { getOverview } from './overview-selectors';

import Component from './overview-component';

const mapStateToProps = getOverview;

export default connect(mapStateToProps, null)(withTranslations(Component));

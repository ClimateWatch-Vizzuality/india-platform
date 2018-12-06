import React from 'react';
import Link from 'redux-first-router-link';

import styles from './climate-policies-detail-header-styles';

const ClimatePoliciesDetailHeaderComponent = () => (
  <div className={styles.headerContainer}>
    <Link
      to={{ type: 'location/CLIMATE_POLICIES' }}
      className={styles.backLink}
    >
      Back to Climate Policies
    </Link>
    <div className={styles.sectionTitle}>Policy name</div>
    <div className={styles.sectionDescription}>Responsible Authority</div>
  </div>
);

export default ClimatePoliciesDetailHeaderComponent;

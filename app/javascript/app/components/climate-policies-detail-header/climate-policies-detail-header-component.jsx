import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import ClimatePolicyProvider from 'providers/climate-policy-provider';

import styles from './climate-policies-detail-header-styles';

const ClimatePoliciesDetailHeaderComponent = (
  { policyDetails, policyCode }
) => (
  <div className={styles.headerContainer}>
    <Link
      to={{ type: 'location/CLIMATE_POLICIES' }}
      className={styles.backLink}
    >
      &#x0003C; Back to Climate Policies
    </Link>
    <div className={styles.sectionTitle}>
      {policyDetails && policyDetails.title}
    </div>
    <div className={styles.sectionDescription}>
      {policyDetails && policyDetails.authority}
    </div>
    <ClimatePolicyProvider params={{ policyCode }} />
  </div>
);

ClimatePoliciesDetailHeaderComponent.propTypes = {
  policyDetails: PropTypes.shape({}),
  policyCode: PropTypes.string
};

ClimatePoliciesDetailHeaderComponent.defaultProps = {
  policyDetails: {},
  policyCode: ''
};

export default ClimatePoliciesDetailHeaderComponent;

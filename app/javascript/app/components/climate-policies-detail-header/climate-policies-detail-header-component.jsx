import React from 'react';
import Link from 'redux-first-router-link';

const ClimatePoliciesDetailHeaderComponent = () => (
  <div>
    <Link to={{ type: 'location/CLIMATE_POLICIES' }}>
      Back to Climate Policies
    </Link>
    <div>Policy name</div>
    <div>Responsible Authority</div>
  </div>
);

export default ClimatePoliciesDetailHeaderComponent;

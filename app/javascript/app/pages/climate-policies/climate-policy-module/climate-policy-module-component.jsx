import React from 'react';
import PropTypes from 'prop-types';
import PoliciesCard from 'components/policies-card';
import { policiesList } from './climate-policies-mock';

import styles from './climate-policy-module-styles';

const ClimatePolicies = ({ title, description }) => (
  <div className={styles.pageLayout}>
    <div className={styles.title}>{title}</div>
    <div className={styles.description}>{description}</div>
    {policiesList.map(policyType => (
      <section className={styles.policyTypeSection} key={policyType.name}>
        <h3 className={styles.title}>{policyType.name}</h3>
        <div className={styles.policiesCardsContainer}>
          {policyType.policies.map(policy => (
            <PoliciesCard
              key={policy.name}
              title={policy.name}
              description={policy.description}
              responsibleAuthority={policy.responsible}
            />
          ))}
        </div>
      </section>
    ))}
  </div>
);

ClimatePolicies.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default ClimatePolicies;

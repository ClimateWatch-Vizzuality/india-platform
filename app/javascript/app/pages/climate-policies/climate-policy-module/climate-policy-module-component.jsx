import React from 'react';
import PropTypes from 'prop-types';
import PoliciesCard from 'components/policies-card';
import SearchCategoriesBox from 'components/search-categories-box';
import { policiesList } from './climate-policies-mock';

import styles from './climate-policy-module-styles';

const ClimatePolicies = ({ title, description }) => (
  <div className={styles.pageLayout}>
    <section className={styles.introAndSearch}>
      <div className={styles.title}>{title}</div>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.description}>{description}</div>
          <SearchCategoriesBox
            onChange={value => console.info(value)}
            placeholder="Feel free to write me"
          />
        </div>
      </div>
    </section>
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

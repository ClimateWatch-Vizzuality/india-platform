import React from 'react';
import PropTypes from 'prop-types';
import ClimatePoliciesProvider from 'providers/climate-policies-provider';
import PoliciesCard from 'components/policies-card';
import SearchCategoriesBox from 'components/search-categories-box';

import styles from './climate-policy-module-styles';

const ClimatePolicies = ({ title, description, policiesListBySector }) => (
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
    {Object.keys(policiesListBySector).map(sector => (
      <section className={styles.policyTypeSection} key={sector}>
        <h3 className={styles.title}>{sector}</h3>
        <div className={styles.policiesCardsContainer}>
          {policiesListBySector[sector].map(policy => (
            <PoliciesCard
              key={policy.title}
              title={policy.title}
              description={policy.description}
              responsibleAuthority={policy.authority}
              action={{
                type: 'location/CLIMATE_POLICY_DETAIL',
                payload: { policy: 'fp', section: 'yea' }
              }}
            />
          ))}
        </div>
      </section>
    ))}
    <ClimatePoliciesProvider />
  </div>
);

ClimatePolicies.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  policiesListBySector: PropTypes.shape({})
};

ClimatePolicies.defaultProps = { policiesListBySector: {} };

export default ClimatePolicies;

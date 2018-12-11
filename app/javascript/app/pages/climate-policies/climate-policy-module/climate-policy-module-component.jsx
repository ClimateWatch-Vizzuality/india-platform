import React from 'react';
import PropTypes from 'prop-types';
import ClimatePoliciesProvider from 'providers/climate-policies-provider';
import PoliciesCard from 'components/policies-card';
import SearchCategoriesBox from 'components/search-categories-box';

import styles from './climate-policy-module-styles';

const SEARCHBOX_TABS = [{slug:'sectors', name:'Sector'}, {slug:'responsible_authority', name:'Responsible Authority'}];
const title = 'Policy module';
// eslint-disable-next-line max-len
const description = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit.';

const ClimatePolicies = ({ policiesListBySector, sectors, authorities }) => console.log(authorities) || (
  <div>
    <section className={styles.pageIntro}>
      <div className={styles.pageLayout}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionDescription}>{description}</p>
      </div>
    </section>
    <div className={styles.pageLayout}>
      <section className={styles.introAndSearch}>
        <div className={styles.title}>{title}</div>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <div className={styles.description}>{description}</div>
            <div className={styles.filterContainer}>
              <SearchCategoriesBox
                onChange={value => console.info(value)}
                placeholder="Search and filter policies"
                tabs={SEARCHBOX_TABS}
                checkBoxes={{sectors, responsible_authority: authorities}}
              />
            </div>
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
                  payload: {
                    policy: policy.code,
                    section: 'overview',
                    data: policy
                  }
                }}
              />
            ))}
          </div>
        </section>
      ))}
      <ClimatePoliciesProvider />
    </div>
  </div>
);

ClimatePolicies.propTypes = { policiesListBySector: PropTypes.shape({}) };

ClimatePolicies.defaultProps = { policiesListBySector: {} };

export default ClimatePolicies;

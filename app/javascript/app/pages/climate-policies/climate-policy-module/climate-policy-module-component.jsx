import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import ClimatePoliciesProvider from 'providers/climate-policies-provider';
import PoliciesCard from 'components/policies-card';
import SearchCategoriesBox from 'components/search-categories-box';
import { NoContent } from 'cw-components';

import styles from './climate-policy-module-styles';

const SEARCHBOX_TABS = [
  { slug: 'sector', name: 'Sector' },
  { slug: 'authority', name: 'Responsible Authority' }
];
const title = 'Policy module';
// eslint-disable-next-line max-len
const description = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit.';

const ClimatePolicies = (
  {
    policiesListBySector,
    sectors,
    authorities,
    onSearchChange,
    onCheckboxChange,
    handleTagRemove,
    handleAllTagsRemove
  }
) => (
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
                onSearchChange={onSearchChange}
                onCheckboxChange={onCheckboxChange}
                handleTagRemove={handleTagRemove}
                handleAllTagsRemove={handleAllTagsRemove}
                placeholder="Search and filter policies"
                tabs={SEARCHBOX_TABS}
                checkBoxes={{ sector: sectors, authority: authorities }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className={styles.policyTypeSectionWrapper}>
        {
          !isEmpty(policiesListBySector)
            ? Object.keys(policiesListBySector).map(sector => (
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
            ))
            : (
              <NoContent
                minHeight={300}
                message="No data found with this search"
              />
)
        }
      </section>
      <ClimatePoliciesProvider />
    </div>
  </div>
);

ClimatePolicies.propTypes = {
  policiesListBySector: PropTypes.shape({}),
  sectors: PropTypes.arrayOf(PropTypes.string),
  authorities: PropTypes.arrayOf(PropTypes.string),
  onSearchChange: PropTypes.func.isRequired,
  handleTagRemove: PropTypes.func.isRequired,
  handleAllTagsRemove: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired
};

ClimatePolicies.defaultProps = {
  policiesListBySector: {},
  sectors: null,
  authorities: null
};

export default ClimatePolicies;

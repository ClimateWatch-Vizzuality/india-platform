import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import universal from 'react-universal-component';
import Sticky from 'react-stickynode';
import { Loading, Dropdown } from 'cw-components';
import { NDC_LINKS_OPTIONS } from 'constants/constants';
import { NDC_LINK } from 'constants/links';
import Nav from 'components/nav';
import navStyles from 'components/nav/nav-styles';

import theme from 'styles/themes/dropdown-links.scss';
import styles from './sections-styles.scss';

const CLIMATE_POLICIES = '/climate-policies';

const universalOptions = {
  loading: <Loading height={500} />,
  minDelay: 400
}
const SectionComponent = universal((
  { page, section } /* webpackChunkName: "[request]" */
) => (import(`../../pages${page}/${section}/${section}.js`)), universalOptions);

const backgrounds = {
}

class Planning extends PureComponent {
  handleStickyChange =  (status) => {
    // Workaround fo fix bad height calculations
    // https://github.com/yahoo/react-stickynode/issues/102#issuecomment-362502692
    if (Sticky.STATUS_FIXED === status.status && this.stickyRef) {
      this.stickyRef.updateInitialDimension();
      this.stickyRef.update();
    }
  }

  handleDocumentDropdownClick = selected => {
    window.open(`${NDC_LINK}/full?document=${selected.value}-EN`, '_blank');
  }

  render() {
    const { route, section, policy, t } = this.props;
    const isClimatePoliciesDetails = route.link === CLIMATE_POLICIES;
    let { sections } = route;
    if (isClimatePoliciesDetails) {
      sections = route.sections.map(s => (
        {
          label: s.label,
          link: {
            type: 'location/CLIMATE_POLICY_DETAIL',
            payload: {
              policy,
              section: s.slug
            }
          }
        }
      ))
    };
    const renderDefaultSectionTitle = () => {
      const page = t(`pages.${route.slug}`);

      if (!page) return null;

      const isClimateGoalsSection = route.slug === 'climate-goals'

      return (
        <div className={styles.row}>
          <h2 className={styles.sectionTitle}>{page.title}</h2>
          <div className='layout-column-container'>
            <div className={styles.descriptionContainer}>
              <p className={styles.sectionDescription}>{page.description}</p>
              {
                isClimateGoalsSection && (
                  <Dropdown
                    className={theme.dropdownWithLink}
                    placeholder="Read India's NDC documents"
                    options={NDC_LINKS_OPTIONS}
                    onValueChange={this.handleDocumentDropdownClick}
                  />
                )
              }
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className={styles.page}>
        <div className={styles.section} style={{backgroundImage: `url('${backgrounds[route.link]}')`}}>
          {
            section.header ? (
              <section.header />
            ) : renderDefaultSectionTitle()
          }
          <div className={styles.row}>
            <Nav theme={{ nav: styles.nav, link: navStyles.linkSubNav }} routes={sections} />
          </div>
        </div>
        <SectionComponent page={route.link} section={section.slug} />
      </div>
    );
  }
}

Planning.propTypes = {
  t: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  section: PropTypes.object.isRequired,
  policy: PropTypes.string
}

Planning.defaultProps = {
  policy: undefined
}

export default Planning;

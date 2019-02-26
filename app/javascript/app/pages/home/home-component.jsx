import React from 'react';
import PropTypes from 'prop-types';
import { Section, Button } from 'cw-components';
import background from 'assets/header';
import SectionTitle from 'components/section-title';
import sectionImage from 'assets/home/image@1x';
import sectionRetinaImage from 'assets/home/image@2x';
import cx from 'classnames';
import buttonThemes from 'styles/themes/button';

import CwDisclaimer from './cw-disclaimer';
import HighlightedStories from './stories';
import SectionsSlideshow from './sections-slideshow';
import styles from './home-styles.scss';

const renderClimatePoliciesSection = t => (
  <div className={styles.climatePoliciesContainer}>
    <div className={styles.climatePoliciesImage}>
      <img
        srcSet={`${sectionImage}, ${sectionRetinaImage} 2x`}
        alt="Mountain"
      />
    </div>
    <div className={styles.climatePoliciesWrapper}>
      <SectionTitle
        title={t('pages.home.progress-of-climate-policies.title')}
        description={t('pages.home.progress-of-climate-policies.description')}
      />
      <Button
        theme={{ button: cx(buttonThemes.primary, styles.button) }}
        link={{ type: 'a', props: { href: '/climate-policies' } }}
      >
        {t('pages.home.progress-of-climate-policies.button')}
      </Button>
    </div>
  </div>
);

const getSlides = t => {
  const slidesObject = t('pages.home.slides');
  return Object
    .keys(slidesObject)
    .map(key => ({ id: key, ...slidesObject[key] }));
};

function Home({ t }) {
  const slides = getSlides(t);

  return (
    <div className={styles.page}>
      <Section backgroundImage={background} theme={styles}>
        <div className="layout-container">
          <div className={styles.introTextContainer}>
            <h1 className={styles.pageTitle}>
              <div className={styles.country}>
                INDIA
              </div>
              <div className={styles.climateExplorer}>
                <span className={styles.bold}>CLIMATE </span>
                EXPLORER
              </div>
            </h1>
            <p className={styles.introText}>
              {t('pages.home.intro-text')}
            </p>
          </div>
        </div>
      </Section>
      <SectionsSlideshow slides={slides} />
      {renderClimatePoliciesSection(t)}
      <CwDisclaimer text={t('pages.home.climate-watch-disclaimer')} />
      <HighlightedStories />
    </div>
  );
}

Home.propTypes = { t: PropTypes.func.isRequired };

export default Home;

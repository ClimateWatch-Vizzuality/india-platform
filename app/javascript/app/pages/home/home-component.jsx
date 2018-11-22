import React from 'react';
import { Section } from 'cw-components';
import background from 'assets/header';
import SectionTitle from 'components/section-title';
import sectionImage from 'assets/home/image@1x';
import sectionRetinaImage from 'assets/home/image@2x';

import CwDisclaimer from './cw-disclaimer';
import HighlightedStories from './stories';
import SectionsSlideshow from './sections-slideshow';
import styles from './home-styles.scss';

const ClimatePoliciesSection = () => (
  <div className={styles.climatePoliciesContainer}>
    <div className={styles.climatePoliciesImage}>
      <img
        srcSet={`${sectionImage}, ${sectionRetinaImage} 2x`}
        alt="Mountain"
      />
    </div>
    <div className={styles.climatePoliciesWrapper}>
      <SectionTitle title="Understand the progress of climate ￼policies" />
      <p className={styles.climatePoliciesDescription}>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
      </p>
      <p className={styles.climatePoliciesDescription}>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit.
      </p>
    </div>
  </div>
);
function Home() {
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
              India Climate Explorer offers open data, visualizations and analysis to help policymakers, researchers and other stakeholders gather insights on India’s climate progress.
            </p>
          </div>
        </div>
      </Section>
      <SectionsSlideshow />
      <ClimatePoliciesSection />
      <CwDisclaimer />
      <HighlightedStories />
    </div>
  );
}
export default Home;

import React from 'react';
import { Section } from 'cw-components';
import background from 'assets/hero';

import styles from './home-styles.scss';

function Home() {
  return (
    <div className={styles.page}>
      <Section backgroundImage={background} theme={styles}>
        <div className="layout-container">
          <div className={styles.introTextContainer}>
            <p className={styles.introText}>
              The Country Platform on{' '}
              <span className={styles.bold}>
                India Climate Explorer
              </span>
              {' '}
              offers open data, visualizations and analysis to help policymakers, researchers and other stakeholders gather insights on India’s climate progress.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
export default Home;

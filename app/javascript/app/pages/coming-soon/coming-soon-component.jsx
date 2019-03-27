import React from 'react';
import PropTypes from 'prop-types';
import { Section } from 'cw-components';
import background from 'assets/header';

import styles from './coming-soon-styles.scss';

function ComingSoon() {
  return (
    <div className={styles.page}>
      <Section backgroundImage={background} theme={styles}>
        <div className="layout-container">
          <div className={styles.introTextContainer}>
            <h1 className={styles.pageTitle}>
              <div className={styles.country}>INDIA</div>
              <div className={styles.climateExplorer}>
                <span className={styles.bold}>CLIMATE </span>
                EXPLORER
              </div>
            </h1>
            <p className={styles.introText}>
              India Climate Explorer is currently under beta-testing. If you are
              interested in supporting us in this testing phase, please email at{' '}
              <a
                className={styles.link}
                href="mailto:indiaclimateexplorer@wri.org"
              >
                indiaclimateexplorer@wri.org
              </a>{' '}
              for login details.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

ComingSoon.propTypes = {};

export default ComingSoon;

import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import PropTypes from 'prop-types';
import ClimatePoliciesProvider from 'providers/climate-policies-provider';
import InfoButton from 'components/info-button';

import styles from './overview-styles';

const renderInfoIcon = () => <InfoButton slugs="" />;

const Overview = ({ policiesByCode, policyCode }) => (
  <div className={styles.pageLayout}>
    <div className={styles.section}>
      <div className={styles.column}>
        <div className={styles.title}>
          <span>Description</span>
        </div>
        {policiesByCode && policiesByCode[policyCode] && (
          <ReactMarkdown
            className={styles.description}
            source={policiesByCode[policyCode].description}
            escapeHtml={false}
          />
        )}
      </div>
      <div className={styles.column}>
        <div className={styles.title}>
          <span>Monitoring</span>
          {renderInfoIcon()}
        </div>
        {policiesByCode && policiesByCode[policyCode] && (
          <ReactMarkdown
            className={styles.description}
            source={policiesByCode[policyCode].tracking_description}
            escapeHtml={false}
          />
        )}
      </div>
    </div>
    <ClimatePoliciesProvider />
  </div>
);

Overview.propTypes = {
  policiesByCode: PropTypes.object,
  policyCode: PropTypes.string
};

Overview.defaultProps = { policiesByCode: {}, policyCode: '' };

export default Overview;

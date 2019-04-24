import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import PropTypes from 'prop-types';
import ClimatePoliciesProvider from 'providers/climate-policies-provider';
import InfoButton from 'components/info-button';

import styles from './overview-styles';

const renderInfoIcon = (policy, sources) => {
  const sourceIds = policy.source_ids;
  const policySources = sourceIds
    .map(sId => sources && sources.find(s => s.id === sId))
    .filter(s => s)
    .map(({ code, name, description, link }) => ({ code, name, description, link }));
  const codes = policySources.map(source => source.code);
  const infoModalData = {
    data: policySources,
    title: 'Sources',
    tabTitles: codes
  };
  return <InfoButton infoModalData={infoModalData} />;
};

const Overview = ({ policiesByCode, policyCode, sources }) => {
  const policy = policiesByCode[policyCode];

  return (
    <div className={styles.pageLayout}>
      {policy && (
        <div className={styles.section}>
          <div className={styles.column}>
            <div className={styles.title}>
              <span>Description</span>
            </div>
            <ReactMarkdown
              className={styles.description}
              source={policy.description}
              escapeHtml={false}
            />
          </div>
          <div className={styles.column}>
            <div className={styles.title}>
              <span>Monitoring</span>
              {renderInfoIcon(policy, sources)}
            </div>
            <ReactMarkdown
              className={styles.description}
              source={policy.tracking_description}
              escapeHtml={false}
            />
          </div>
        </div>
      )}
      <ClimatePoliciesProvider />
    </div>
  );
};

Overview.propTypes = {
  policiesByCode: PropTypes.object,
  policyCode: PropTypes.string,
  sources: PropTypes.array
};

Overview.defaultProps = { policiesByCode: {}, policyCode: '', sources: [] };

export default Overview;

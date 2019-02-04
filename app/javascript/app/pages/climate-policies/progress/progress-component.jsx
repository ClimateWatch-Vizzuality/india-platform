import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ClimatePolicyProvider from 'providers/climate-policy-provider';
import TextProgress from './text-progress';
import ChartProgress from './chart-progress';
import styles from './progress-styles';

const renderProgress = indicator => {
  if (!indicator) return null;

  switch (indicator.progress_display) {
    case 'text': {
      return <TextProgress indicator={indicator} />;
    }
    case 'bar_chart': {
      return <ChartProgress chartType="bar" indicator={indicator} />;
    }
    case 'stacked_bar_chart': {
      return (
        <ChartProgress chartType="stacked_bar_chart" indicator={indicator} />
      );
    }
    default:
      return null;
  }
};

class Progress extends PureComponent {
  render() {
    const { indicatorsProgress: indicators, policyCode } = this.props;

    if (!policyCode) return null;

    return (
      <div className={styles.page}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>
            Snapshot of progress
          </div>
        </div>
        {(indicators || []).map(indicator => (
          <div key={`${indicator.code}-row`} className={styles.row}>
            <div className={styles.container}>
              {renderProgress(indicator)}
            </div>
          </div>
        ))}
        <ClimatePolicyProvider params={{ policyCode }} />
      </div>
    );
  }
}

Progress.propTypes = {
  indicatorsProgress: PropTypes.array,
  policyCode: PropTypes.string
};

Progress.defaultProps = { indicatorsProgress: [], policyCode: null };

export default Progress;

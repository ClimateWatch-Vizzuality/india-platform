import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ClimatePolicyProvider from 'providers/climate-policy-provider';
import ChartDisplay from './chart-display';
import ProgressBarDisplay from './progress-bar-display';
import TextDisplay from './text-display';

import styles from './progress-styles';

const renderProgress = indicator => {
  if (!indicator) return null;

  const ProgressDisplay = ({
    text: TextDisplay,
    bar_chart: ChartDisplay,
    stacked_bar_chart: ChartDisplay,
    progress_bar: ProgressBarDisplay
  })[indicator.progress_display];

  if (!ProgressDisplay) return null;

  return <ProgressDisplay indicator={indicator} />;
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

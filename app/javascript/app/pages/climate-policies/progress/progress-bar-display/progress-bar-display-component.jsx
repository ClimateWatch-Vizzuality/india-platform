import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { formatDate } from 'utils';
import InfoButton from 'components/info-button';
import ProgressBar from 'components/progress-bar';

import styles from './progress-bar-display-styles';

class ProgressBarDisplay extends PureComponent {
  renderProgress = record => {
    const { indicator } = this.props;
    const progressPercentage = (record.value / record.target) * 100;
    const key = `${record.indicator_code}_${record.axis_x}`;

    return (
      <div key={key}>
        <div className={styles.progressText}>
          {`${record.value} ${indicator.unit} out of ${
            record.target
          } (${progressPercentage.toFixed(0)}%)`}
        </div>
        <ProgressBar progress={progressPercentage} />
      </div>
    );
  };

  render() {
    const { indicator } = this.props;

    return (
      <div className={styles.barProgress}>
        <div className={styles.indicatorTitle}>{indicator.title}</div>
        <div>{indicator.progress_records.map(this.renderProgress)}</div>
        <div className={styles.lastUpdate}>
          <span className={styles.date}>
            Last update: {formatDate(indicator.updated_at)}
          </span>
          <InfoButton dark infoModalData={indicator.infoModalData} />
        </div>
      </div>
    );
  }
}

ProgressBarDisplay.propTypes = { indicator: PropTypes.object.isRequired };

export default ProgressBarDisplay;

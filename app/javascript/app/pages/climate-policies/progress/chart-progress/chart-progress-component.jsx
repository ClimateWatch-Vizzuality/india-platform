import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';

import { formatDate } from 'utils';

import Chart from 'components/chart';
import BarTooltipChart from 'components/chart/bar-tooltip-chart';
import InfoButton from 'components/info-button';

import styles from './chart-progress-styles';

class ChartProgress extends PureComponent {
  handleLegendChange = selected => {
    const { onFilterChange, indicator } = this.props;

    const filter = `${indicator.code}_category`;
    const values = isArray(selected)
      ? selected.map(v => v.value).join(',')
      : selected.value;

    onFilterChange({ [filter]: values });
  };

  render() {
    const { chartType, chartData, indicator } = this.props;

    if (!indicator) return null;

    const tooltip = chartType === 'stacked_bar' ? <BarTooltipChart /> : null;

    return (
      <React.Fragment>
        <div className={styles.chartProgress}>
          <div className={styles.indicatorTitle}>
            {indicator.title}
          </div>
          <div className={styles.lastUpdate}>
            <span className={styles.date}>
              Last update: {formatDate(indicator.updated_at)}
            </span>
            <InfoButton dark slugs="" />
          </div>
        </div>
        <div className={styles.chartContainer}>
          {
            chartData &&
              (
                <Chart
                  type="bar"
                  config={chartData.config}
                  data={chartData.data}
                  dataOptions={chartData.dataOptions}
                  dataSelected={chartData.dataSelected}
                  loading={false}
                  domain={chartData.domain}
                  height={300}
                  barSize={50}
                  customTooltip={tooltip}
                  onLegendChange={this.handleLegendChange}
                />
              )
          }
        </div>
      </React.Fragment>
    );
  }
}

ChartProgress.propTypes = {
  chartData: PropTypes.object,
  indicator: PropTypes.object.isRequired,
  chartType: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

ChartProgress.defaultProps = { chartData: null };

export default ChartProgress;
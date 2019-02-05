import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';

import { formatDate } from 'utils';

import Chart from 'components/chart';
import BarTooltipChart from 'components/chart/bar-tooltip-chart';
import InfoButton from 'components/info-button';

import styles from './chart-display-styles';

class ChartDisplay extends PureComponent {
  handleLegendChange = selected => {
    const { onFilterChange, indicator } = this.props;

    const filter = `${indicator.code}_category`;
    const values = isArray(selected)
      ? selected.map(v => v.value).join(',')
      : selected.value;

    onFilterChange({ [filter]: values });
  };

  render() {
    const { chartData, indicator } = this.props;

    if (!indicator) return null;

    const tooltip = (
      <BarTooltipChart
        showEmptyValues={false}
        getCustomValueFormat={chartData.tooltipCustomValueFormat}
      />
    );

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

ChartDisplay.propTypes = {
  chartData: PropTypes.object,
  indicator: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

ChartDisplay.defaultProps = { chartData: null };

export default ChartDisplay;

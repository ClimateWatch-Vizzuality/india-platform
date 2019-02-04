import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';

import { formatDate } from 'utils';
import {
  getThemeConfig,
  getTooltipConfig,
  getYColumnValue
} from 'utils/graphs';
import Chart from 'components/chart';
import InfoButton from 'components/info-button';

import styles from '../progress-styles';

const getAxes = (xName, yName) => ({
  xBottom: { name: xName, unit: '', format: 'string' },
  yLeft: { name: yName, unit: '', format: 'number' }
});

const getTheme = color => ({ y: { stroke: color, fill: color } });

const getBarChartData = indicator => {
  const data = indicator.progress_records.map(record => ({
    x: record.axis_x,
    y: Number(record.value)
  }));

  return {
    data,
    domain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
    config: {
      axes: getAxes('Year', 'Value'),
      tooltip: {
        y: { label: 'People', format: value => `${format(',.4s')(`${value}`)}` }
      },
      animation: false,
      columns: {
        x: [ { label: 'year', value: 'x' } ],
        y: [ { label: '', value: 'y' } ]
      },
      theme: getTheme('#2EC926')
    }
  };
};

const getStackedBarChartData = indicator => {
  const categories = uniq(indicator.progress_records.map(r => r.category));
  const dataGroupedByAxisX = groupBy(indicator.progress_records, 'axis_x');

  const data = Object
    .keys(dataGroupedByAxisX)
    .map(axisX => ({
      x: axisX,
      ...dataGroupedByAxisX[axisX].reduce(
        (acc, d) => ({ ...acc, [getYColumnValue(d.category)]: d.value }),
        {}
      )
    }));
  const yColumns = categories.map(c => ({
    label: c,
    value: getYColumnValue(c),
    stackId: 'stack'
  }));

  return {
    data,
    domain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
    config: {
      axes: getAxes('Year', 'Value'),
      animation: false,
      columns: { x: [ { label: 'year', value: 'x' } ], y: yColumns },
      theme: getThemeConfig(yColumns),
      tooltip: getTooltipConfig(yColumns)
    }
  };
};

const getChartData = (chartType, indicator) => {
  if (!get(indicator, 'progress_records.length')) return null;

  if (chartType === 'bar') return getBarChartData(indicator);
  if (chartType === 'stacked_bar') return getStackedBarChartData(indicator);

  return null;
};

const ChartProgress = ({ chartType, indicator }) => {
  if (!indicator) return null;

  const chartData = getChartData(chartType, indicator);

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
                loading={false}
                domain={chartData.domain}
                margin={{ bottom: 10 }}
                height={300}
                barSize={30}
              />
            )
        }
      </div>
    </React.Fragment>
  );
};

ChartProgress.propTypes = {
  indicator: PropTypes.object.isRequired,
  chartType: PropTypes.string.isRequired
};

export default ChartProgress;

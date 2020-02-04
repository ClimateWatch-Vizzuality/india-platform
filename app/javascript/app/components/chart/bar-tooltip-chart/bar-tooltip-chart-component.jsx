import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import isNumber from 'lodash/isNumber';
import isNil from 'lodash/isNil';
import styles from './bar-tooltip-chart-styles';

const renderValue = ({ formatFunction }, y) => {
  const value = y.payload && y.payload[y.dataKey];

  if (!value) return 'n/a';
  if (formatFunction) return formatFunction(y);
  return format(',')(value);
};

class BarTooltipChart extends PureComponent {
  getTotal() {
    const { content } = this.props;
    const payload = content && content.payload;
    const total =
      payload &&
      payload.length > 0 &&
      payload.reduce((acc, current) => (isNumber(current.value) ? acc + current.value : acc), 0);
    return total && format(',.4s')(total);
  }

  render() {
    const { config, content, showEmptyValues, showTotal } = this.props;
    const yUnit = config && config.axes && config.axes.yLeft && config.axes.yLeft.unit;
    const payload = content && content.payload;
    const shouldShowTotal = showTotal && payload.length > 1;

    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipRow}>
          <span>{content.label}</span>
          <span>{yUnit}</span>
        </div>
        {shouldShowTotal && (
          <div key="total" className={cx(styles.tooltipRow, styles.total)}>
            <span>TOTAL</span>
            <span>{this.getTotal()}</span>
          </div>
        )}
        {payload &&
          payload.length > 0 &&
          sortBy(payload, 'value').map(y =>
            y.payload &&
            y.dataKey !== 'total' &&
            config.tooltip[y.dataKey] &&
            config.tooltip[y.dataKey].label &&
            (showEmptyValues || (!showEmptyValues && !isNil(y.payload[y.dataKey]))) ? (
              <div key={`${y.dataKey}`} className={styles.tooltipRow}>
                {yUnit && (
                  <span>
                    <span
                      className={styles.dot}
                      style={{
                        backgroundColor: config.theme[y.dataKey].stroke
                      }}
                    />
                    <span
                      className={styles.unit}
                      /* eslint-disable-line*/
                      dangerouslySetInnerHTML={{
                        __html: config.tooltip[y.dataKey].label
                      }}
                    />
                  </span>
                )}
                <span>{renderValue(config.tooltip, y)}</span>
              </div>
            ) : null)}
        {content && !content.payload && <div>No data available</div>}
      </div>
    );
  }
}

BarTooltipChart.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object,
  showTotal: PropTypes.bool,
  showEmptyValues: PropTypes.bool
};

BarTooltipChart.defaultProps = {
  content: {},
  config: {},
  showTotal: true,
  showEmptyValues: true
};

export default BarTooltipChart;

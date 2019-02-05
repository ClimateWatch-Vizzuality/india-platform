import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import isNumber from 'lodash/isNumber';
import isNil from 'lodash/isNil';
import styles from './bar-tooltip-chart-styles';

class BarTooltipChart extends PureComponent {
  getTotal() {
    const { content } = this.props;
    const payload = content && content.payload;
    const total = payload &&
      payload.length > 0 &&
      payload.reduce(
        (acc, current) => isNumber(current.value) ? acc + current.value : acc,
        0
      );
    return total && format(',.4s')(total);
  }

  sortByValue = payload => {
    const yValues = payload[0].payload;
    const compare = (a, b) => {
      if (yValues[b.dataKey] === undefined) return -1;
      if (yValues[a.dataKey] === undefined) return 1;
      return yValues[b.dataKey] - yValues[a.dataKey];
    };
    return payload.sort(compare);
  };

  renderValue = y => {
    const { getCustomValueFormat } = this.props;
    const value = y.payload && y.payload[y.dataKey];

    if (value !== undefined) {
      if (getCustomValueFormat) {
        return getCustomValueFormat(y);
      }

      return format(',')(value);
    }
    return 'n/a';
  };

  render() {
    const { config, content, showEmptyValues } = this.props;
    const yUnit = config &&
      config.axes &&
      config.axes.yLeft &&
      config.axes.yLeft.unit;
    const payload = content && content.payload;

    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipHeader}>
          <span>
            {content.label}
          </span>
          <span>
            {`${yUnit} ${this.getTotal()}`}
          </span>
        </div>
        {
          payload && payload.length > 0 && sortBy(payload, 'value').map(
              y =>
                y.payload &&
                  y.dataKey !== 'total' &&
                  config.tooltip[y.dataKey] &&
                  config.tooltip[y.dataKey].label &&
                  (showEmptyValues ||
                    !showEmptyValues && !isNil(y.payload[y.dataKey]))
                  ? (
                    <div key={`${y.dataKey}`} className={styles.tooltipHeader}>
                      {
                      yUnit && (
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
                        )
                    }
                      <span>
                        {this.renderValue(y)}
                      </span>
                    </div>
)
                  : null
            )
        }
        {content && !content.payload && <div>No data available</div>}
      </div>
    );
  }
}

BarTooltipChart.propTypes = {
  content: PropTypes.object,
  config: PropTypes.object,
  showEmptyValues: PropTypes.bool,
  getCustomValueFormat: PropTypes.func
};

BarTooltipChart.defaultProps = {
  content: {},
  config: {},
  showEmptyValues: true,
  getCustomValueFormat: null
};

export default BarTooltipChart;

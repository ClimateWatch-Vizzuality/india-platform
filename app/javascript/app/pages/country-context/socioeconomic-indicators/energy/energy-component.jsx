import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Dropdown } from 'cw-components';
import isArray from 'lodash/isArray';
import Switch from 'components/switch';
import dropdownStyles from 'styles/themes/dropdown.scss';
import styles from './energy-styles.scss';

class Energy extends PureComponent {
  handleFilterChange = (filter, selected) => {
    const { onFilterChange } = this.props;
    let values;
    if (isArray(selected)) {
      values = selected.map(v => v.value).join(',');
    } else {
      values = selected.value;
    }
    onFilterChange({ [filter]: values });
  };

  render() {
    const {
      chartData,
      selectedOptions,
      options,
      loading,
      selectedSource
    } = this.props;

    const indicatorLabel = 'Indicators';

    return (
      <div className={styles.page}>
        <SectionTitle title="Energy" description="Energy description" />
        <Switch
          options={[
            { name: 'Energy Supply', value: 'energy_supply' },
            { name: 'Energy Consumption', value: 'energy_consumption' }
          ]}
          value={selectedSource}
          handleChange={selected =>
            this.handleFilterChange('energySource', selected)}
        />
        <div className={styles.container}>
          <div className={styles.toolbox}>
            <div className={styles.dropdown}>
              <Dropdown
                key={indicatorLabel}
                label={indicatorLabel}
                placeholder={`Filter by ${indicatorLabel}`}
                options={options || []}
                onValueChange={selected =>
                  this.handleFilterChange('energyIndicator', selected)}
                value={selectedOptions.energyIndicator}
                theme={{ select: dropdownStyles.select }}
                hideResetButton
              />
            </div>
            <InfoDownloadToolbox
              className={{ buttonWrapper: styles.buttonWrapper }}
              slugs=""
              downloadUri=""
            />
          </div>
          {
            chartData &&
              chartData.data &&
              (
                <Chart
                  type="line"
                  loading={loading}
                  config={chartData.config}
                  theme={{ legend: styles.legend }}
                  data={chartData.data}
                  dots={false}
                  domain={chartData.domain}
                  getCustomYLabelFormat={chartData.config.yLabelFormat}
                  dataOptions={chartData.dataOptions || []}
                  dataSelected={chartData.dataSelected}
                  height={500}
                  margin={{ left: '200px' }}
                  showUnit
                  onLegendChange={v => this.handleFilterChange('categories', v)}
                />
              )
          }
        </div>
      </div>
    );
  }
}

Energy.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  selectedOptions: PropTypes.object,
  selectedSource: PropTypes.string.isRequired,
  options: PropTypes.array,
  loading: PropTypes.bool
};

Energy.defaultProps = {
  selectedOptions: {},
  options: [],
  chartData: {},
  loading: false
};

export default Energy;

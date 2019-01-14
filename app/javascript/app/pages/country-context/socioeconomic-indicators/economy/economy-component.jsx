import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Dropdown } from 'cw-components';

import dropdownStyles from 'styles/themes/dropdown';
import CustomTooltip from '../population/bar-chart-tooltip';
import styles from '../population/population-styles';

class Economy extends PureComponent {
  handleFilterChange = (filter, selected) => {
    const { onFilterChange } = this.props;
    onFilterChange({ [filter]: selected.value });
  };

  render() {
    const {
      nationalChartData,
      provincialChartData,
      nationalOptions,
      provincesOptions,
      selectedOptions
    } = this.props;

    const nationalIndLabel = 'National Indicator';
    const provinceIndLabel = 'State';

    return (
      <div className={styles.page}>
        <SectionTitle
          title="Economic profile"
          description="Economic profile description"
        />
        <div className={styles.container}>
          <div className="first-column">
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={nationalIndLabel}
                  label={provinceIndLabel}
                  options={nationalOptions}
                  onValueChange={selected =>
                    this.handleFilterChange('gdpNationalIndicator', selected)}
                  value={selectedOptions.gdpNationalIndicator}
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
              nationalChartData &&
                (
                  <Chart
                    type="line"
                    dots={false}
                    lineType="linear"
                    config={nationalChartData.config}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    dataOptions={nationalChartData.dataOptions}
                    dataSelected={nationalChartData.dataSelected}
                    getCustomYLabelFormat={
                      nationalChartData.config.yLabelFormat
                    }
                    data={nationalChartData.data}
                    domain={nationalChartData.domain}
                    height={300}
                  />
                )
            }
          </div>
          <div className="second-column">
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={provinceIndLabel}
                  label={provinceIndLabel}
                  options={provincesOptions}
                  onValueChange={selected =>
                    this.handleFilterChange('gdpProvince', selected)}
                  value={selectedOptions.gdpProvince}
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
              provincialChartData &&
                (
                  <Chart
                    type="line"
                    dots={false}
                    lineType="linear"
                    config={provincialChartData.config}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    dataOptions={provincialChartData.dataOptions}
                    dataSelected={provincialChartData.dataSelected}
                    getCustomYLabelFormat={
                      provincialChartData.config.yLabelFormat
                    }
                    data={provincialChartData.data}
                    domain={provincialChartData.domain}
                    height={300}
                  />
                )
            }
          </div>
        </div>
      </div>
    );
  }
}

Economy.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  nationalChartData: PropTypes.object,
  provincialChartData: PropTypes.object,
  nationalOptions: PropTypes.array,
  provincesOptions: PropTypes.array,
  selectedOptions: PropTypes.object
};

Economy.defaultProps = {
  nationalChartData: {},
  provincialChartData: {},
  provincesOptions: [],
  nationalOptions: [],
  selectedOptions: {}
};

export default Economy;

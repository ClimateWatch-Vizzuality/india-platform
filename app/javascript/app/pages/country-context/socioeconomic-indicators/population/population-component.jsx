import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Dropdown } from 'cw-components';

import dropdownStyles from 'styles/themes/dropdown';
import CustomTooltip from '../shared/bar-chart-tooltip';
import styles from '../socioeconomic-indicators-styles';

class Population extends PureComponent {
  handleFilterChange = (filter, selected) => {
    const { onFilterChange } = this.props;
    onFilterChange({ [filter]: selected.value });
  };

  render() {
    const {
      chartData,
      popStateChartData,
      nationalIndicatorsOptions,
      popStatesOptions,
      selectedOptions
    } = this.props;

    const nationalIndLabel = 'National Indicators';
    const stateIndLabel = 'State';
    return (
      <div className={styles.page}>
        <SectionTitle title="Population" description="Population description" />
        <div className={styles.container}>
          <div className="first-column">
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={nationalIndLabel}
                  label={nationalIndLabel}
                  placeholder={`Filter by ${nationalIndLabel}`}
                  options={nationalIndicatorsOptions}
                  onValueChange={selected =>
                    this.handleFilterChange('popNationalIndicator', selected)}
                  value={selectedOptions.popNationalIndicator}
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
                (
                  <Chart
                    type="bar"
                    config={chartData.config}
                    data={chartData.data}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    getCustomYLabelFormat={chartData.config.yLabelFormat}
                    domain={chartData.domain}
                    dataOptions={chartData.dataOptions}
                    dataSelected={chartData.dataSelected}
                    height={300}
                    barSize={30}
                  />
                )
            }
          </div>
          <div className="second-column">
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={stateIndLabel}
                  label={stateIndLabel}
                  placeholder={`Filter by ${stateIndLabel}`}
                  options={popStatesOptions}
                  onValueChange={selected =>
                    this.handleFilterChange('popState', selected)}
                  value={selectedOptions.popState}
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
              popStateChartData &&
                (
                  <Chart
                    type="bar"
                    config={popStateChartData.config}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    dataOptions={popStateChartData.dataOptions}
                    dataSelected={popStateChartData.dataSelected}
                    getCustomYLabelFormat={
                      popStateChartData.config.yLabelFormat
                    }
                    data={popStateChartData.data}
                    domain={popStateChartData.domain}
                    height={300}
                    barSize={30}
                  />
                )
            }
          </div>
        </div>
      </div>
    );
  }
}

Population.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  popStateChartData: PropTypes.object.isRequired,
  nationalIndicatorsOptions: PropTypes.array.isRequired,
  popStatesOptions: PropTypes.array.isRequired,
  selectedOptions: PropTypes.object.isRequired
};

Population.defaultProps = { chartData: {} };

export default Population;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Dropdown } from 'cw-components';
import Switch from 'components/switch';

import dropdownStyles from 'styles/themes/dropdown';
import CustomTooltip from '../shared/bar-chart-tooltip';
import styles from '../socioeconomic-indicators-styles';

class Economy extends PureComponent {
  handleFilterChange = (filter, selected) => {
    const { onFilterChange } = this.props;
    onFilterChange({ [filter]: selected.value });
  };

  render() {
    const {
      nationalChartData,
      nationalOptions,
      selectedIndicator,
      selectedSource,
      loading,
      sources,
      downloadURI,
      t
    } = this.props;

    const nationalIndLabel = 'National Indicator';

    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.country-context.socioeconomic.economy.title')}
          description={t(
            'pages.country-context.socioeconomic.economy.description'
          )}
        />
        <Switch
          options={[
            { name: 'Gross Domestic Product', value: 'GDP' },
            { name: 'Employment', value: 'Employment' }
          ]}
          value={selectedSource}
          handleChange={selected =>
            this.handleFilterChange('economySource', selected)}
        />
        <div>
          <div className="first-column">
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={nationalIndLabel}
                  label={nationalIndLabel}
                  options={nationalOptions || []}
                  onValueChange={selected =>
                    this.handleFilterChange(
                      'economyNationalIndicator',
                      selected
                    )}
                  value={selectedIndicator}
                  theme={{ select: dropdownStyles.select }}
                  hideResetButton
                />
                {}
              </div>
              <InfoDownloadToolbox
                className={{ buttonWrapper: styles.buttonWrapper }}
                slugs={sources}
                downloadUri={downloadURI}
              />
            </div>
            {
              nationalChartData &&
                (
                  <Chart
                    type="line"
                    dots={false}
                    lineType="linear"
                    loading={loading}
                    config={nationalChartData.config}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    dataOptions={nationalChartData.dataOptions || []}
                    dataSelected={nationalChartData.dataSelected}
                    getCustomYLabelFormat={
                      nationalChartData.config.yLabelFormat
                    }
                    data={nationalChartData.data}
                    domain={nationalChartData.domain}
                    margin={{ bottom: 10 }}
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
  selectedIndicator: PropTypes.object,
  nationalOptions: PropTypes.array,
  selectedSource: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  sources: PropTypes.array.isRequired,
  downloadURI: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

Economy.defaultProps = {
  nationalChartData: {},
  selectedIndicator: {},
  nationalOptions: [],
  loading: false
};

export default Economy;

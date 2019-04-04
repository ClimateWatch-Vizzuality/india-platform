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

class Population extends PureComponent {
  render() {
    const {
      chartData,
      nationalIndicatorsOptions,
      selectedIndicator,
      selectedSource,
      loading,
      sources,
      downloadURI,
      onSwitchChange,
      onLegendChange,
      onIndicatorChange,
      t
    } = this.props;

    const nationalIndLabel = 'National Indicators';
    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.country-context.socioeconomic.population.title')}
          description={t(
            'pages.country-context.socioeconomic.population.description'
          )}
        />
        <Switch
          options={[
            { name: 'population', value: 'CAIT' },
            { name: 'population by gender', value: 'population_by_gender' },
            { name: 'Human Development Index', value: 'hdi' }
          ]}
          value={selectedSource}
          handleChange={onSwitchChange}
        />
        <div>
          <div className="first-column">
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={nationalIndLabel}
                  label={nationalIndLabel}
                  placeholder={`Filter by ${nationalIndLabel}`}
                  options={nationalIndicatorsOptions}
                  onValueChange={onIndicatorChange}
                  value={selectedIndicator}
                  theme={{ select: dropdownStyles.select }}
                  hideResetButton
                />
              </div>
              <InfoDownloadToolbox
                className={{ buttonWrapper: styles.buttonWrapper }}
                slugs={sources}
                downloadUri={downloadURI}
              />
            </div>
            {chartData && (
              <Chart
                type="bar"
                loading={loading}
                config={chartData.config}
                data={chartData.data}
                theme={{ legend: styles.legend }}
                customTooltip={<CustomTooltip />}
                getCustomYLabelFormat={chartData.config.yLabelFormat}
                domain={chartData.domain}
                dataOptions={chartData.dataOptions}
                dataSelected={chartData.dataSelected}
                margin={{ top: 20, bottom: 10 }}
                height={300}
                barSize={30}
                onLegendChange={onLegendChange}
                showUnit
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

Population.propTypes = {
  onSwitchChange: PropTypes.func.isRequired,
  onLegendChange: PropTypes.func.isRequired,
  onIndicatorChange: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  nationalIndicatorsOptions: PropTypes.array,
  selectedIndicator: PropTypes.object,
  selectedSource: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  sources: PropTypes.array.isRequired,
  downloadURI: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

Population.defaultProps = {
  chartData: {},
  loading: false,
  nationalIndicatorsOptions: null,
  selectedIndicator: null
};

export default Population;

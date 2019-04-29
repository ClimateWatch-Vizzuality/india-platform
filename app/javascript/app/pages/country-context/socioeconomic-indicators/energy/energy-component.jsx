import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import cx from 'classnames';
import { Dropdown, Button, Icon } from 'cw-components';
import openInNew from 'assets/icons/open-in-new';

import buttonThemes from 'styles/themes/button';
import iconThemes from 'styles/themes/icon';
import isArray from 'lodash/isArray';
import Switch from 'components/switch';
import dropdownStyles from 'styles/themes/dropdown.scss';
import styles from '../socioeconomic-indicators-styles';

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
      selectedSource,
      sources,
      downloadURI,
      t
    } = this.props;

    const indicatorLabel = 'Indicators';

    return (
      <div className={styles.page}>
        <div>
          <SectionTitle
            title={t('pages.country-context.socioeconomic.energy.title')}
            description={t(
              'pages.country-context.socioeconomic.energy.description'
            )}
            extraContent={(
              <Button
                theme={{
                  button: cx(buttonThemes.yellow, styles.powerExplorerButton)
                }}
                disabled
              >
                Visit Power Explorer
                <Icon icon={openInNew} theme={{ icon: iconThemes.openInNew }} />
              </Button>
)}
          />
        </div>
        <Switch
          options={[
            { name: 'Energy Supply', value: 'energy_supply' },
            { name: 'Energy Consumption', value: 'energy_consumption' }
          ]}
          value={selectedSource}
          handleChange={selected =>
            this.handleFilterChange('energySource', selected)
          }
        />
        <div className="first-column">
          <div className={styles.toolbox}>
            <div className={styles.dropdown}>
              <Dropdown
                key={indicatorLabel}
                label={indicatorLabel}
                placeholder={`Filter by ${indicatorLabel}`}
                options={options || []}
                onValueChange={selected =>
                  this.handleFilterChange('energyIndicator', selected)
                }
                value={selectedOptions.energyIndicator}
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
          {chartData && chartData.data && (
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
              margin={{ top: 40, left: -15, bottom: 10 }}
              showUnit
              onLegendChange={v => this.handleFilterChange('categories', v)}
            />
          )}
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
  loading: PropTypes.bool,
  sources: PropTypes.array.isRequired,
  downloadURI: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

Energy.defaultProps = {
  selectedOptions: {},
  options: [],
  chartData: {},
  loading: false
};

export default Energy;

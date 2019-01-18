import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Dropdown } from 'cw-components';
import dropdownStyles from 'styles/themes/dropdown';
import styles from './climate-finance-styles.scss';

class ClimateFinance extends PureComponent {
  render() {
    const {
      fundOptions,
      selectedFund,
      onFilterChange,
      chartData,
      loading
    } = this.props;
    return (
      <div className={styles.climateFinance}>
        <SectionTitle
          title="Climate finance"
          description="Climate finance description"
        />
        <div className={styles.toolbox}>
          <div className={styles.dropdown}>
            <Dropdown
              key="Fund"
              label="Fund"
              placeholder="Filter by Fund"
              options={fundOptions}
              onValueChange={onFilterChange}
              value={selectedFund}
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
                loading={loading}
                config={chartData.config}
                data={chartData.data}
                theme={{ legend: styles.legend }}
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
    );
  }
}

ClimateFinance.propTypes = {
  fundOptions: PropTypes.array,
  selectedFund: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  loading: PropTypes.bool
};

ClimateFinance.defaultProps = {
  fundOptions: [],
  selectedFund: undefined,
  chartData: undefined,
  loading: false
};

ClimateFinance.defaultProps = {};

export default ClimateFinance;

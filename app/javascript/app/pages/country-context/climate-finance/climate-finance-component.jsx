import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Multiselect } from 'cw-components';
import dropdownStyles from 'styles/themes/dropdown';
import ClimateFinanceProvider from 'providers/climate-finance-provider';
import castArray from 'lodash/castArray';
import styles from './climate-finance-styles.scss';
import BarTooltipChart from './bar-tooltip-chart/bar-tooltip-chart-component';

class ClimateFinance extends PureComponent {
  handleFilterChange = selected => {
    const { onFilterChange, selectedFund } = this.props;

    const prevSelectedOptionValues = castArray(selectedFund).map(o => o.value);
    const selectedArray = castArray(selected);
    const newSelectedOption = selectedArray.find(
      o => !prevSelectedOptionValues.includes(o.value)
    );

    const removedAnyPreviousOverride = selectedArray
      .filter(v => v)
      .filter(v => !v.override);

    const values = newSelectedOption && newSelectedOption.override
      ? newSelectedOption.value
      : removedAnyPreviousOverride.map(v => v.value).join(',');

    onFilterChange({ fund: values });
  };

  render() {
    const { fundOptions, selectedFund, chartData, loading, t } = this.props;

    return (
      <div className={styles.climateFinance}>
        <SectionTitle
          title={t('pages.country-context.climate-finance.title')}
          description={t('pages.country-context.climate-finance.description')}
        />
        <div className={styles.toolbox}>
          <div className={styles.dropdown}>
            <Multiselect
              key="Fund"
              label="Fund"
              placeholder="Filter by Fund"
              options={fundOptions || []}
              onValueChange={this.handleFilterChange}
              values={selectedFund ? castArray(selectedFund) : []}
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
                dataOptions={chartData.dataOptions.filter(o => !o.override)}
                dataSelected={castArray(
                  chartData.dataSelected.filter(o => !o.override)
                )}
                onLegendChange={this.handleFilterChange}
                height={300}
                margin={{ top: 30, left: -33 }}
                barSize={30}
                customTooltip={<BarTooltipChart />}
                showUnit
              />
            )
        }
        <ClimateFinanceProvider />
      </div>
    );
  }
}

ClimateFinance.propTypes = {
  fundOptions: PropTypes.array,
  selectedFund: PropTypes.array,
  onFilterChange: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  loading: PropTypes.bool,
  t: PropTypes.func.isRequired
};

ClimateFinance.defaultProps = {
  fundOptions: [],
  selectedFund: undefined,
  chartData: undefined,
  loading: false
};

ClimateFinance.defaultProps = {};

export default ClimateFinance;

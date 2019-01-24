import React, { PureComponent } from 'react';
import SectionTitle from 'components/section-title';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import MetadataProvider from 'providers/metadata-provider';
import { Button, Icon, Dropdown, Multiselect, Chart } from 'cw-components';
import buttonThemes from 'styles/themes/button';
import iconThemes from 'styles/themes/icon';
import openInNew from 'assets/icons/open-in-new';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import startCase from 'lodash/startCase';
import castArray from 'lodash/castArray';
import { METRIC_OPTIONS, SECTOR_TOTAL } from 'constants/constants';
import PropTypes from 'prop-types';
import dropdownStyles from 'styles/dropdown.scss';

import styles from './historical-emissions-styles.scss';

const CW_COMPARE_LINK = 'https://www.climatewatchdata.org/countries/compare?locations=IND';

const renderButtons = () => (
  <div className={styles.buttons}>
    <div
      data-for="buttonTooltip"
      data-tip="This is not official government information"
    >
      <Button
        theme={{ button: cx(buttonThemes.yellow, styles.powerExplorerButton) }}
        link={{ type: 'a', props: { href: '', target: '_blank' } }}
      >
        Explore by sector and state
        <Icon icon={openInNew} theme={{ icon: iconThemes.openInNew }} />
      </Button>
    </div>
    <Button
      theme={{ button: cx(buttonThemes.yellow, styles.powerExplorerButton) }}
      link={{ type: 'a', props: { href: CW_COMPARE_LINK, target: '_blank' } }}
    >
      Compare with other countries
      <Icon icon={openInNew} theme={{ icon: iconThemes.openInNew }} />
    </Button>
    <ReactTooltip
      id="buttonTooltip"
      effect="solid"
      className="global_blueTooltip"
    />
  </div>
);

// eslint-disable-next-line react/prefer-stateless-function
class HistoricalEmissions extends PureComponent {
  handleFilterChange = (field, selected) => {
    const { onFilterChange, selectedOptions } = this.props;

    const prevSelectedOptionValues = castArray(selectedOptions[field]).map(
      o => o.value
    );
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

    onFilterChange({ [field]: values });
  };

  addAllSelected(field) {
    const { filterOptions, allSelectedOption, selectedOptions } = this.props;
    const absoluteMetric = selectedOptions.metric ===
      METRIC_OPTIONS.ABSOLUTE_VALUE;
    if (!filterOptions) return [];
    let options = filterOptions[field] || [];
    if (absoluteMetric && field === 'sector') {
      options = options.filter(v => v.code !== SECTOR_TOTAL);
    }
    const NON_ALL_SELECTED_KEYS = [ 'metric', 'gas' ];
    const noAllSelected = NON_ALL_SELECTED_KEYS.includes(field);
    if (noAllSelected) return options;

    return [ allSelectedOption, ...options ];
  }

  renderDropdown(field, multi) {
    const { selectedOptions } = this.props;
    const value = selectedOptions && selectedOptions[field];
    const label = startCase(field);
    if (multi) {
      const absoluteMetric = selectedOptions.metric.value ===
        METRIC_OPTIONS.ABSOLUTE_VALUE;
      const disabled = field === 'sector' && !absoluteMetric;
      const values = castArray(value).filter(v => v);
      return (
        <Multiselect
          key={field}
          label={label}
          placeholder={`Filter by ${startCase(field)}`}
          options={this.addAllSelected(field)}
          onValueChange={selected => this.handleFilterChange(field, selected)}
          values={values}
          theme={{ wrapper: dropdownStyles.select }}
          hideResetButton
          disabled={disabled}
        />
      );
    }
    return (
      <Dropdown
        key={field}
        label={label}
        placeholder={`Filter by ${startCase(field)}`}
        options={this.addAllSelected(field)}
        onValueChange={selected => this.handleFilterChange(field, selected)}
        value={value || null}
        theme={{ select: dropdownStyles.select }}
        hideResetButton
        disabled /* Remove when Metric is ready */
      />
    );
  }

  render() {
    const { emissionParams, chartData } = this.props;
    return (
      <div className={styles.historicalEmissions}>
        <SectionTitle
          title="Historical emissions"
          description="Historical emissions description"
          extraContent={renderButtons()}
        />
        <div className={styles.dropdowns}>
          {this.renderDropdown('sector', true)}
          {this.renderDropdown('gas', true)}
          {this.renderDropdown('metric')}
          <InfoDownloadToolbox
            className={{ buttonWrapper: styles.buttonWrapper }}
            slugs=""
            downloadUri=""
          />
        </div>
        <div className={styles.chartContainer}>
          {
            chartData &&
              chartData.data &&
              (
                <Chart
                  theme={{
                    legend: styles.legend,
                    projectedLegend: styles.projectedLegend
                  }}
                  type="bar"
                  config={chartData.config}
                  data={chartData.data}
                  dataOptions={chartData.dataOptions}
                  dataSelected={chartData.dataSelected}
                  height={500}
                  barSize={40}
                  loading={chartData.loading}
                  onLegendChange={v => this.handleFilterChange('sector', v)}
                  showUnit
                />
              )
          }
        </div>
        <MetadataProvider meta="ghg" />
        {emissionParams && <GHGEmissionsProvider params={emissionParams} />}
      </div>
    );
  }
}

HistoricalEmissions.propTypes = {
  chartData: PropTypes.object,
  filterOptions: PropTypes.object,
  allSelectedOption: PropTypes.object,
  selectedOptions: PropTypes.object,
  emissionParams: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired
};

HistoricalEmissions.defaultProps = {
  chartData: undefined,
  filterOptions: undefined,
  allSelectedOption: undefined,
  selectedOptions: undefined,
  emissionParams: undefined
};

export default HistoricalEmissions;

import React, { PureComponent } from 'react';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import PropTypes from 'prop-types';
import EspLocationsProvider from 'providers/esp-locations-provider';
import EspModelsProvider from 'providers/esp-models-provider';
import EspScenariosProvider from 'providers/esp-scenarios-provider';
import EspIndicatorsProvider from 'providers/esp-indicators-provider';
import EspTimeSeriesProvider from 'providers/esp-time-series-provider';
import { Dropdown, Chart, Button, Icon } from 'cw-components';
import openInNew from 'assets/icons/open-in-new';
import buttonThemes from 'styles/themes/button';
import iconThemes from 'styles/themes/icon';
import cx from 'classnames';
import styles from './emission-pathways-styles.scss';

const CW_PATHWAYS_LINK = 'https://www.climatewatchdata.org/pathways';

class EmissionPathways extends PureComponent {
  renderCustomMessage() {
    const { filtersSelected } = this.props;
    const getName = attribute =>
      filtersSelected[attribute] && filtersSelected[attribute].label;
    const unavailableIndicatorName = getName('indicator')
      ? ` , ${getName('indicator')}`
      : '';
    return `${getName('location')} doesn't have any data for ${getName(
      'model'
    )}${unavailableIndicatorName}. `;
  }

  render() {
    const {
      data,
      config,
      loading,
      error,
      filtersLoading,
      filtersOptions,
      filtersSelected,
      handleSelectorChange,
      handleModelChange,
      handleLegendChange,
      t
    } = this.props;
    const needsTimeSeries = filtersSelected &&
      filtersSelected.location &&
      filtersSelected.model;
    const filtersDisabled = filtersLoading.indicators ||
      filtersLoading.timeseries ||
      filtersLoading.models;
    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.country-context.emission-pathways.title')}
          description={t('pages.country-context.emission-pathways.description')}
          extraContent={
            (
              <Button
                theme={{
                  button: cx(buttonThemes.yellow, styles.powerExplorerButton)
                }}
                link={{
                  type: 'a',
                  props: { href: CW_PATHWAYS_LINK, target: '_blank' }
                }}
              >
                Explore pathways
                <Icon icon={openInNew} theme={{ icon: iconThemes.openInNew }} />
              </Button>
            )
          }
        />
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <EspModelsProvider />
            <EspScenariosProvider />
            <EspIndicatorsProvider />
            <EspLocationsProvider withTimeSeries />
            {
              needsTimeSeries &&
                (
                  <EspTimeSeriesProvider
                    location={filtersSelected.location.value}
                    model={filtersSelected.model.value}
                  />
                )
            }
            <div className="grid-column-item">
              <div className={styles.selectorsWrapper}>
                <Dropdown
                  label="Model"
                  options={filtersOptions.models}
                  onValueChange={handleModelChange}
                  disabled={filtersLoading.location}
                  value={filtersSelected.model}
                  hideResetButton
                />
                <Dropdown
                  label="Category"
                  placeholder="Select a category"
                  options={filtersOptions.category}
                  hideResetButton
                  disabled={filtersDisabled}
                  onValueChange={option =>
                    handleSelectorChange(option, 'category')}
                  value={filtersSelected.category}
                />
                <Dropdown
                  label="Subcategory"
                  placeholder="Select a subcategory"
                  options={filtersOptions.subcategory}
                  hideResetButton
                  disabled={filtersDisabled}
                  onValueChange={option =>
                    handleSelectorChange(option, 'subcategory')}
                  value={filtersSelected.subcategory}
                />
                <Dropdown
                  label="Indicator"
                  placeholder="Select an indicator"
                  options={filtersOptions.indicators}
                  hideResetButton
                  disabled={filtersDisabled}
                  onValueChange={option =>
                    handleSelectorChange(option, 'indicator')}
                  value={filtersSelected.indicator}
                />
                <InfoDownloadToolbox
                  className={{ buttonWrapper: styles.buttonWrapper }}
                  slugs=""
                  downloadUri=""
                />
              </div>
            </div>
            <Chart
              className={styles.chartWrapper}
              type="line"
              config={config}
              data={data}
              dataOptions={filtersOptions.scenarios}
              dataSelected={filtersSelected.scenario}
              customMessage={this.renderCustomMessage()}
              height={600}
              loading={loading}
              error={error}
              margin={{ bottom: 40, top: 20 }}
              onLegendChange={handleLegendChange}
              showUnit
            />
          </div>
        </div>
      </div>
    );
  }
}

EmissionPathways.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  filtersLoading: PropTypes.object,
  filtersOptions: PropTypes.object,
  filtersSelected: PropTypes.object,
  handleSelectorChange: PropTypes.func.isRequired,
  handleModelChange: PropTypes.func.isRequired,
  handleLegendChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

EmissionPathways.defaultProps = {
  data: undefined,
  config: undefined,
  loading: false,
  error: false,
  filtersLoading: undefined,
  filtersOptions: undefined,
  filtersSelected: undefined
};

export default EmissionPathways;

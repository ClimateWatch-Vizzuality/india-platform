import { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import qs from 'query-string';
import isArray from 'lodash/isArray';

import withTranslations from 'providers/translations-provider/with-translations.hoc';
import actions from './emission-pathways-actions';
import reducers, { initialState } from './emission-pathways-reducers';

import EmissionPathwayGraphComponent from './emission-pathways-component';
import {
  getChartData,
  getChartDomainWithYMargins,
  getChartConfig,
  getFiltersOptions,
  getFiltersSelected,
  getModelSelected
} from './emission-pathways-selectors';

const mapStateToProps = state => {
  const { data } = state.espTimeSeries;
  const search = qs.parse(state.location.search);
  const {
    currentLocation,
    model,
    indicator,
    scenario,
    category,
    subcategory
  } = search;
  const espData = {
    data,
    locations: state.espLocations.data,
    models: state.espModels.data,
    allScenarios: state.espScenarios.data,
    indicators: state.espIndicators.data,
    location: currentLocation,
    availableModels: state.espGraph.locations,
    model,
    indicator,
    scenario,
    category,
    subcategory,
    search
  };
  const providers = [
    'espTimeSeries',
    'espLocations',
    'espModels',
    'espScenarios',
    'espIndicators',
    'espGraph'
  ];
  const filtersSelected = getFiltersSelected(espData);
  return {
    data: getChartData(espData),
    domain: getChartDomainWithYMargins(espData),
    config: getChartConfig(espData),
    filtersLoading: {
      timeseries: state.espTimeSeries.loading,
      locations: state.espLocations.loading,
      models: state.espModels.loading,
      indicators: state.espIndicators.loading
    },
    filtersOptions: getFiltersOptions(espData),
    filtersSelected,
    model: getModelSelected(espData),
    error: providers.some(p => state[p].error),
    loading: providers.some(p => state[p].loading) || !filtersSelected.model,
    search,
    location: state.location
  };
};

class EmissionPathwaysContainer extends PureComponent {
  componentDidMount() {
    const { filtersSelected, findAvailableModels } = this.props;
    const { location } = filtersSelected;
    if (location) {
      const locationId = location.value || location;
      findAvailableModels(locationId);
    }
  }

  componentDidUpdate(prevProps) {
    const { filtersSelected, findAvailableModels, search } = this.props;
    if (prevProps.filtersSelected.location !== filtersSelected.location) {
      const currentLocation = filtersSelected.location;
      findAvailableModels(currentLocation.value);
    }

    this.updateUrlWithNewParams(search, filtersSelected);
  }

  getLocationParamUpdated(params = [], clear = false) {
    const { updateFiltersSelected } = this.props;

    const { search } = this.props;
    const newFilters = {};
    const paramsArray = isArray(params) ? params : [ params ];
    paramsArray.forEach(param => {
      newFilters[param.name] = param.value;
    });
    const newSearch = clear ? { ...newFilters } : { ...search, ...newFilters };

    updateFiltersSelected({ section: 'emission-pathways', query: newSearch });
  }

  updateUrlWithNewParams = (search, filtersSelected) => {
    const possibleParams = [
      'model',
      'category',
      'subcategory',
      'indicator',
      'currentLocation',
      'scenario'
    ];
    const paramsToUpdate = [];
    const getFilterParamValue = f => {
      if (isArray(filtersSelected[f])) {
        return search[f]
          ? filtersSelected[f]
            .filter(selectedFilter => search[f].includes(selectedFilter.value))
            .join(',')
          : filtersSelected[f].map(filter => filter.value).join(',');
      }
      return filtersSelected[f].value;
    };

    possibleParams.forEach(f => {
      if (!search[f]) {
        if (f === 'currentLocation' && filtersSelected.location) {
          paramsToUpdate.push({
            name: f,
            value: filtersSelected[f] && filtersSelected[f].value ||
              filtersSelected.location.value
          });
        } else if (f !== 'currentLocation' && filtersSelected[f]) {
          const value = getFilterParamValue(f);
          if (value) paramsToUpdate.push({ name: f, value });
        }
      }
    });
    if (paramsToUpdate.length) this.getLocationParamUpdated(paramsToUpdate);
  };

  handleModelChange = model => {
    const { filtersSelected } = this.props;
    const { location } = filtersSelected;
    const params = [
      { name: 'model', value: model.value },
      {
        name: 'scenario',
        value: model.scenarios ? model.scenarios.toString() : ''
      }
    ];
    if (location && location.value) {
      params.push({ name: 'currentLocation', value: location.value });
    }
    this.getLocationParamUpdated(params, true);
  };

  handleSelectorChange = (option, param, clear) => {
    const params = [ { name: param, value: option ? option.value : '' } ];
    if (param === 'category') {
      params.push({ name: 'subcategory', value: '' });
    }
    if (param === 'category' || param === 'subcategory') {
      params.push({ name: 'indicator', value: '' });
    }
    this.getLocationParamUpdated(params, clear);
  };

  handleLegendChange = value => {
    this.handleSelectorChange(
      { value: value.map(v => v.value).join() },
      'scenario'
    );
  };

  render() {
    return createElement(EmissionPathwayGraphComponent, {
      ...this.props,
      handleModelChange: this.handleModelChange,
      handleSelectorChange: this.handleSelectorChange,
      handleClearSelection: this.handleClearSelection,
      handleLegendChange: this.handleLegendChange
    });
  }
}

EmissionPathwaysContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  filtersSelected: PropTypes.object.isRequired,
  findAvailableModels: PropTypes.func.isRequired,
  search: PropTypes.object,
  location: PropTypes.object
};

EmissionPathwaysContainer.defaultProps = { search: {}, location: {} };

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(
  withTranslations(EmissionPathwaysContainer)
);

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isArray from 'lodash/isArray';

import withTranslations from 'providers/translations-provider/with-translations.hoc';
import { getPopulation } from './population-selectors';
import * as actions from './population-actions';

import Component from './population-component';

const mapStateToProps = getPopulation;

class PopulationContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;
    const updatedFilter = { ...filter };
    if (Object.keys(filter).includes('populationSource')) {
      updatedFilter.popNationalIndicator = undefined;
    }
    updateFiltersSelected({ query: { ...query, ...updatedFilter } });
  };

  updateSwitchFilter = newFilter => {
    this.onFilterChange({
      populationSource: newFilter.value,
      popState: undefined
    });
  };

  updateIndicatorFilter = newFilter => {
    this.onFilterChange({
      popNationalIndicator: newFilter.value,
      popState: undefined
    });
  };

  updateLegendFilter = newFilter => {
    let values;
    if (isArray(newFilter)) {
      values = newFilter.map(v => v.value).join(',');
    } else {
      values = newFilter.value;
    }
    this.onFilterChange({ popState: values });
  };

  render() {
    return (
      <Component
        {...this.props}
        onSwitchChange={this.updateSwitchFilter}
        onIndicatorChange={this.updateIndicatorFilter}
        onLegendChange={this.updateLegendFilter}
      />
    );
  }
}

PopulationContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object
};

PopulationContainer.defaultProps = { query: {} };

export default connect(
  mapStateToProps,
  actions
)(withTranslations(PopulationContainer));

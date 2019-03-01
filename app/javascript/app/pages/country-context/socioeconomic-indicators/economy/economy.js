import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isArray from 'lodash/isArray';

import withTranslations from 'providers/translations-provider/with-translations.hoc';
import { getEconomy } from './economy-selectors';
import * as actions from './economy-actions';

import Component from './economy-component';

const mapStateToProps = getEconomy;

class EconomyContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;
    const updatedFilter = { ...filter };
    if (Object.keys(filter).includes('economySource')) {
      updatedFilter.economyNationalIndicator = undefined;
    }
    updateFiltersSelected({ query: { ...query, ...updatedFilter } });
  };

  updateIndicatorFilter = newFilter => {
    this.onFilterChange({
      economyNationalIndicator: newFilter.value,
      economyState: undefined
    });
  };

  updateSwitchFilter = newFilter => {
    this.onFilterChange({ economySource: newFilter.value });
  };

  updateLegendFilter = newFilter => {
    let values;
    if (isArray(newFilter)) {
      values = newFilter.map(v => v.value).join(',');
    } else {
      values = newFilter.value;
    }
    this.onFilterChange({ economyState: values });
  };

  render() {
    return (
      <Component
        {...this.props}
        onIndicatorChange={this.updateIndicatorFilter}
        onLegendChange={this.updateLegendFilter}
        onSwitchChange={this.updateSwitchFilter}
      />
    );
  }
}

EconomyContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object
};

EconomyContainer.defaultProps = { query: {} };

export default connect(mapStateToProps, actions)(
  withTranslations(EconomyContainer)
);

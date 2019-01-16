import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getEnergy } from './energy-selectors';
import * as actions from './energy-actions';

import Component from './energy-component';

const mapStateToProps = getEnergy;

class EnergyContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;
    const updatedFilter = { ...filter };
    if (Object.keys(filter).includes('energySource')) {
      updatedFilter.energyIndicator = undefined;
    }
    updateFiltersSelected({ query: { ...query, ...updatedFilter } });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

EnergyContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object
};

EnergyContainer.defaultProps = { query: {} };

export default connect(mapStateToProps, actions)(EnergyContainer);

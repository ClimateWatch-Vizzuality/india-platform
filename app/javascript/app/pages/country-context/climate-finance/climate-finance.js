import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getClimateFinance } from './climate-finance-selectors';
import * as actions from './climate-finance-actions';

import Component from './climate-finance-component';

const mapStateToProps = getClimateFinance;

class FinanceContainer extends PureComponent {
  onFilterChange = selected => {
    const { updateFiltersSelected, query } = this.props;
    updateFiltersSelected({ query: { ...query, fund: selected } });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

FinanceContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object
};

FinanceContainer.defaultProps = { query: {} };

export default connect(mapStateToProps, actions)(FinanceContainer);

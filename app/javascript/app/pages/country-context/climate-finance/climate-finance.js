import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withTranslations from 'providers/translations-provider/with-translations.hoc';
import { getClimateFinance } from './climate-finance-selectors';
import * as actions from './climate-finance-actions';

import Component from './climate-finance-component';

const mapStateToProps = getClimateFinance;

class FinanceContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;
    updateFiltersSelected({
      section: 'climate-finance',
      query: { ...query, ...filter }
    });
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

export default connect(mapStateToProps, actions)(
  withTranslations(FinanceContainer)
);

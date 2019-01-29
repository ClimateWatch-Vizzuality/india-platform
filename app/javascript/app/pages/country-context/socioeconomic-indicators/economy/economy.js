import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
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

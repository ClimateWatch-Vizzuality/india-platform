import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { searchSelectors } from './search-categories-box-selectors';
import Component from './search-categories-box-component';
import * as actions from './search-categories-box-actions';

class SearchFilterContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;
    updateFiltersSelected({ query: { ...query, ...filter } });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

SearchFilterContainer.propTypes = {
  query: PropTypes.shape({}),
  updateFiltersSelected: PropTypes.func.isRequired
};

SearchFilterContainer.defaultProps = { query: null };

export default connect(searchSelectors, actions)(SearchFilterContainer);

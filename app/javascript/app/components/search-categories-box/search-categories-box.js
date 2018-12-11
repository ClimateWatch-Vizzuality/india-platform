import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Component from './search-categories-box-component';
import * as actions from './search-categories-box-actions';

class SearchFilterContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;
    console.log(query)
    updateFiltersSelected({
      query: {...query, ...filter}
    });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

const mapStateToProps = ({ location }) => ({
  query: location.query
})

SearchFilterContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired
};


export default connect(mapStateToProps, actions)(SearchFilterContainer);
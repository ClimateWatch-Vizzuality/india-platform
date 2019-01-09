import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, isArray } from 'lodash';
import { climatePolicies } from './climate-policy-module-selectors';
import * as actions from './climate-policy-module-actions';

import ClimatePolicyComponent from './climate-policy-module-component';

class ClimatePolicyContainer extends PureComponent {
  onSearchChange = value => {
    const { updateFiltersSelected, query } = this.props;
    const filter = { description: value };
    if (query && query.description) {
      const { description, ...rest } = query;
      // delete description key from new object if it is empty
      const updatedQuery = value ? { ...query, ...filter } : { ...rest };
      updateFiltersSelected({ query: updatedQuery });
    } else {
      updateFiltersSelected({ query: { ...query, ...filter } });
    }
  };

  handleCheckboxChange = (event, selectedTab) => {
    const { query, updateFiltersSelected } = this.props;
    const key = [ selectedTab.slug ];
    const input = event.target.id;
    const selectedTabFilters = query && query[key];
    const isFilterActive = selectedTabFilters &&
      selectedTabFilters.includes(input);
    let updatedFilters;
    if (isFilterActive) {
      const foldedFilter = isArray(query[key]) ? query[key] : [ query[key] ];
      updatedFilters = {
        ...query,
        [key]: foldedFilter.filter(f => f !== input)
      };
    } else {
      updatedFilters = selectedTabFilters
        ? { [key]: [ ...query[key], input ] }
        : { [key]: [ input ] };
    }
    updatedFilters = isEmpty(updatedFilters[key]) ? {} : { ...updatedFilters };
    if (isEmpty(updatedFilters[key])) {
      delete query[key];
    }
    updateFiltersSelected({ query: { ...query, ...updatedFilters } });
  };

  handleTagRemove = filter => {
    const { query, updateFiltersSelected } = this.props;
    const updatedFilters = Object.keys(query).reduce((acc, key) => {
      if (isArray(query[key])) {
        return query[key].includes(filter)
          ? { ...acc, [key]: query[key].filter(i => i !== filter) }
          : { ...acc, [key]: query[key] };
      }
      return query[key].includes(filter)
        ? { ...acc, [key]: [] }
        : { ...acc, [key]: query[key] };
    }, {});
    Object.keys(updatedFilters).forEach(k => {
      if (isEmpty(updatedFilters[k])) {
        delete query[k];
        delete updatedFilters[k];
      }
    });
    updateFiltersSelected({ query: { ...query, ...updatedFilters } });
  };

  handleAllTagsRemove = () => {
    const { updateFiltersSelected } = this.props;
    updateFiltersSelected({ query: null });
  };

  render() {
    return (
      <ClimatePolicyComponent
        {...this.props}
        onSearchChange={this.onSearchChange}
        onCheckboxChange={this.handleCheckboxChange}
        handleTagRemove={this.handleTagRemove}
        handleAllTagsRemove={this.handleAllTagsRemove}
      />
    );
  }
}

ClimatePolicyContainer.propTypes = {
  query: PropTypes.shape({}),
  updateFiltersSelected: PropTypes.func.isRequired
};

ClimatePolicyContainer.defaultProps = { query: null };

export default connect(climatePolicies, actions)(ClimatePolicyContainer);

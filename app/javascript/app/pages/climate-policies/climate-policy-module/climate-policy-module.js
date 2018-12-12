import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { climatePolicies } from './climate-policy-module-selectors';
import * as actions from './climate-policy-module-actions';

import Component from './climate-policy-module-component';

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

  render() {
    return <Component {...this.props} onSearchChange={this.onSearchChange} />;
  }
}

ClimatePolicyContainer.propTypes = {
  query: PropTypes.shape({}),
  updateFiltersSelected: PropTypes.func.isRequired
};

ClimatePolicyContainer.defaultProps = { query: null };

export default connect(climatePolicies, actions)(ClimatePolicyContainer);

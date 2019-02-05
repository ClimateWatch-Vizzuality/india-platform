import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPolicyCode } from 'selectors/climate-policies-selectors';
import * as actions from './chart-display-actions';
import Component from './chart-display-component';
import { getQuery, getChartData } from './chart-display-selectors';

class ChartDisplayContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query, policyCode } = this.props;
    updateFiltersSelected({
      policy: policyCode,
      section: 'progress',
      query: { ...query, ...filter }
    });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

ChartDisplayContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  policyCode: PropTypes.string.isRequired,
  query: PropTypes.object
};

ChartDisplayContainer.defaultProps = { query: {} };

const mapStateToProps = (state, { indicator }) => ({
  query: getQuery(state),
  policyCode: getPolicyCode(state),
  chartData: getChartData(indicator)(state)
});

export default connect(mapStateToProps, actions)(ChartDisplayContainer);

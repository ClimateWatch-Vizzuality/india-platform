import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPolicyCode } from 'selectors/climate-policies-selectors';
import * as actions from './chart-progress-actions';
import Component from './chart-progress-component';
import { getQuery, getChartData } from './chart-progress-selectors';

class ChartProgressContainer extends PureComponent {
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

ChartProgressContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  policyCode: PropTypes.string.isRequired,
  query: PropTypes.object
};

ChartProgressContainer.defaultProps = { query: {} };

const mapStateToProps = (state, { chartType, indicator }) => ({
  query: getQuery(state),
  policyCode: getPolicyCode(state),
  chartData: getChartData(chartType, indicator)(state)
});

export default connect(mapStateToProps, actions)(ChartProgressContainer);

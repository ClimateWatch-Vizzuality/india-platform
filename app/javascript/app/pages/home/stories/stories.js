import { connect } from 'react-redux';
import Component from './stories-component';
import { getStoriesForIndia } from './stories-selectors';

const mapStateToProps = state => ({
  stories: getStoriesForIndia(state)
});

export default connect(
  mapStateToProps,
  null
)(Component);

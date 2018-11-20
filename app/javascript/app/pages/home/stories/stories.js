import { connect } from 'react-redux';
import story1Image from 'assets/home/stories/story_1@1x';
import story2Image from 'assets/home/stories/story_2@1x';
import story3Image from 'assets/home/stories/story_3@1x';
import Component from './stories-component';

const stories = [
  {
    date: 'Oct 5, 2018',
    title: 'How can India achieve its climate change mitigation goal?',
    description: 'An analysis of potential emissions reductions from energy and land-use policies.',
    link: 'todo',
    background_image_url: story1Image
  },
  {
    date: 'Oct 5, 2018',
    title: 'Got climate questions?',
    description: 'Climate Watch has answers!',
    link: 'todo',
    background_image_url: story2Image
  },
  {
    date: 'Oct 5, 2018',
    title: 'Stepping into the future',
    description: 'Creating long-term strategies for low GHG emissions and development.',
    link: 'todo',
    background_image_url: story3Image
  }
];

const mapStateToProps = () => ({ stories });

export default connect(mapStateToProps, null)(Component);

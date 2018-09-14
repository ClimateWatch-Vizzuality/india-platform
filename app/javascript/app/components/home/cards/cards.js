import { connect } from 'react-redux';

import CardsComponent from './cards-component';

const mapStateToProps = () => ({
  cardsData: [
    {
      title: 'Understand India’s country context',
      cardContent: 'Understand India’s country context'
    },
    {
      title: 'Explore India’s Nationally Determined Contribution',
      cardContent: 'Understand India’s country context'
    },
    {
      title: 'Track the impact of climate policies',
      cardContent: 'Understand India’s country context'
    }
  ]
});
export default connect(mapStateToProps, null)(CardsComponent);

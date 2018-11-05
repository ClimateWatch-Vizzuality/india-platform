import { connect } from 'react-redux';

import { COUNTRY_CONTEXT, routes } from 'router/router';
import CardsComponent from './cards-component';

const mapStateToProps = () => {
  const getLink = page => routes[page].link;
  return {
    cardsData: [
      {
        title: 'Understand India’s country context',
        button: {
          link: getLink(COUNTRY_CONTEXT),
          text: 'Go to country context',
          style: 'outline'
        }
      },
      {
        title: 'Explore India’s Nationally Determined Contribution',
        button: {
          link: '',
          text: `Explore India's NDC`,
          style: 'primary',
          props: { disabled: true }
        }
      },
      {
        title: 'Track the impact of climate policies',
        button: {
          link: '',
          text: 'Go to climate policies',
          style: 'outline',
          props: { disabled: true }
        }
      }
    ]
  };
};
export default connect(mapStateToProps, null)(CardsComponent);

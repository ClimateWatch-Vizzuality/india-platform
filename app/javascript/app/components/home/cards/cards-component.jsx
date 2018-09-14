import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'cw-components';
import styles from './cards-styles.scss';

class Cards extends PureComponent {
  render() {
    const { cardsData } = this.props;
    return (
      <div className={styles.cardsContainer}>
        {
          cardsData && cardsData.map(card => (
            <div key={card.title} className={styles.cardElement}>
              <Card title={card.title} theme={styles}>
                <div className={styles.cardActions}>
                    Hello
                </div>
              </Card>
            </div>
            ))
        }
      </div>
    );
  }
}
Cards.propTypes = {
  cardsData: PropTypes.arrayOf(
    PropTypes.shape({ title: PropTypes.string, description: PropTypes.string })
  )
};

Cards.defaultProps = { cardsData: [] };

export default Cards;

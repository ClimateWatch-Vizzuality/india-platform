import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'cw-components';
import { NavLink } from 'redux-first-router-link';
import buttonThemes from 'styles/themes/button';
import cx from 'classnames';
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
                  <NavLink
                    exact
                    className={styles.cardButton}
                    to={card.button.link}
                    onTouchStart={undefined}
                    onMouseDown={undefined}
                  >
                    <Button
                      {...card.button.props}
                      theme={{
                          button: cx(
                            buttonThemes[card.button.style],
                            styles.button
                          )
                        }}
                    >
                      {card.button.text}
                    </Button>
                  </NavLink>
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

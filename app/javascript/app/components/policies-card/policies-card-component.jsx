import React from 'react';
import PropTypes from 'prop-types';

import styles from './policies-card-styles';

const PoliciesCardComponent = (
  { title, responsibleAuthority, description }
) => (
  <div className={styles.cardContainer}>
    <h3 className={styles.title}>{title}</h3>
    <h6 className={styles.responsibleAuthority}>{responsibleAuthority}</h6>
    <p className={styles.description}>{description}</p>
  </div>
);

PoliciesCardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  responsibleAuthority: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default PoliciesCardComponent;

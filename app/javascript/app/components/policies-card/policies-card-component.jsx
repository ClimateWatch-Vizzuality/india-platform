import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Truncate from 'react-truncate-markup';

import styles from './policies-card-styles';

const PoliciesCardComponent = (
  { title, responsibleAuthority, description, action }
) => (
  <Link className={styles.cardContainer} to={action}>
    <h3 className={styles.title}>{title}</h3>
    <h6 className={styles.responsibleAuthority}>{responsibleAuthority}</h6>
    <Truncate lines={3}>
      <p className={styles.description}>{description}</p>
    </Truncate>
  </Link>
);

PoliciesCardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  responsibleAuthority: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.shape({}).isRequired
};

export default PoliciesCardComponent;

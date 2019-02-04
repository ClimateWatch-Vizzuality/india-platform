import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from 'utils';
import InfoButton from 'components/info-button';

import styles from '../progress-styles';

const normalizeValue = value =>
  Number.isNaN(Number(value)) ? value : Number(value).toString();

const showCategoryWithValue = progress =>
  [ progress.axis_x, normalizeValue(progress.value) ].filter(x => x).join(': ');

const TextProgress = ({ indicator }) => (
  <div className={styles.textProgress}>
    <div className={styles.indicatorTitle}>
      {indicator.title}
    </div>
    <ul>
      {indicator.progress_records.map(progress => (
        <li key={progress.axis_x}>
          {showCategoryWithValue(progress)}
          {indicator.unit && ` ${indicator.unit}`}
        </li>
      ))}
    </ul>
    <div className={styles.lastUpdate}>
      <span className={styles.date}>
        Last update: {formatDate(indicator.updated_at)}
      </span>
      <InfoButton dark slugs="" />
    </div>
  </div>
);

TextProgress.propTypes = { indicator: PropTypes.object.isRequired };

export default TextProgress;

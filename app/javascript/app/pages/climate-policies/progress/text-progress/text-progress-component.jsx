import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from 'utils';
import InfoButton from 'components/info-button';

import styles from '../progress-styles';

const TextProgress = ({ indicator }) => (
  <div className={styles.textProgress}>
    <div className={styles.indicatorTitle}>
      {indicator.title}
    </div>
    <ul>
      {indicator.progress_records.map(progress => (
        <li key={progress.axis_x}>
          {[ progress.axis_x, progress.value ].filter(x => x).join(': ')}
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

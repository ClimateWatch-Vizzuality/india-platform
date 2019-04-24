import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { formatDate } from 'utils';
import InfoButton from 'components/info-button';

import styles from './text-display-styles';

const TextDisplay = ({ indicator }) => {
  const tabTitles =
    indicator && indicator.sources && indicator.sources.map(({ code }) => code);
  const infoModalData = {
    data: indicator ? indicator.sources : [],
    title: 'Sources',
    tabTitles
  };

  return (
    <div className={styles.textProgress}>
      <div className={styles.indicatorTitle}>{indicator.title}</div>
      <ul>
        {indicator.progress_records.map(progress => (
          <li key={progress.value}>
            <ReactMarkdown source={progress.value} escapeHtml={false} />
          </li>
        ))}
      </ul>
      <div className={styles.lastUpdate}>
        <span className={styles.date}>
          Last update: {formatDate(indicator.updated_at)}
        </span>
        <InfoButton dark slugs="" infoModalData={infoModalData} />
      </div>
    </div>
  );
};

TextDisplay.propTypes = { indicator: PropTypes.object.isRequired };

export default TextDisplay;

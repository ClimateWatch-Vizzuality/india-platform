import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ClimatePoliciesProvider from 'providers/climate-policies-provider';
import InfoButton from 'components/info-button';
import { Icon } from 'cw-components';
import openInNew from 'assets/icons/open_in_new';

import styles from './instruments-styles';

// const renderInfoIcon = () => <InfoButton slugs="" />;
const columnNames = [
  'Title:',
  'Policy status:',
  'Key milestones dates:',
  'Implementation entity/entities:',
  'The broader context/significance of the policy instrument:'
];

const handleOnClick = () => window.open('https://www.google.com', '_blank');

const Instruments = ({ instruments }) => (
  <div className={styles.page}>
    <div className={styles.titleContainer}>
      <div className={styles.title}>
        Policy Instruments
      </div>
    </div>
    <table className={styles.table}>
      <tbody>
        {columnNames.map(column => (
          <tr className={styles.row}>
            <td className={cx(styles.nameColumn, styles.cell)}>{column}</td>
            <td className={cx(styles.cell)}>
              {
                instruments[column] &&
                  <ReactMarkdown source={instruments[column].content} />
              }
            </td>
            <td className={cx(styles.cell, styles.updateColumn)}>
              <span>
                Last update: {instruments[column] && instruments[column].update}
              </span>
              <InfoButton slugs="" theme={{ icon: styles.icon }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className={styles.pageLayout}>
      <div className={styles.section}>
        <button
          type="button"
          className={styles.document}
          onClick={handleOnClick}
        >
          <span className={styles.link}>Government tracking documents</span>
          <Icon
            alt="open in new tab"
            icon={openInNew}
            theme={{ icon: styles.icon }}
          />
        </button>
      </div>
    </div>
    <ClimatePoliciesProvider />
  </div>
);

Instruments.propTypes = { instruments: PropTypes.array };

Instruments.defaultProps = { instruments: [] };

export default Instruments;

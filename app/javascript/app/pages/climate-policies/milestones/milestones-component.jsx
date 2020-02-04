import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import lowerCase from 'lodash/lowerCase';
import capitalize from 'lodash/capitalize';
import DateTime from 'luxon/src/datetime';
import cx from 'classnames';
import ClimatePolicyProvider from 'providers/climate-policy-provider';
import { TabletLandscape, TabletPortraitOnly } from 'components/responsive';
import { Icon } from 'cw-components';

import attained from 'assets/icons/attained';
import issued from 'assets/icons/issued';
import estimated from 'assets/icons/estimated';
import launched from 'assets/icons/launched';

import styles from './milestones-styles';

const ICONS = { attained, issued, estimated, launched };

const formatDate = date => DateTime.fromISO(date).toFormat('yyyy');

const table = milestones => (
  <table className={styles.table}>
    <tbody>
      {milestones.map(milestone => (
        <tr
          key={`${milestone.name}-${milestone.data_source_link}`}
          className={styles.row}
        >
          <td className={cx(styles.statusColumn, styles.cell)}>
            <TabletLandscape>
              <span className={styles.status}>
                {capitalize(milestone.status)}
              </span>
            </TabletLandscape>
            <Icon
              icon={ICONS[lowerCase(milestone.status)]}
              theme={{ icon: cx(styles.statusIcon) }}
            />
          </td>
          <td className={cx(styles.cell, styles.description)}>
            <TabletPortraitOnly>
              <p>{capitalize(milestone.status)}</p>
            </TabletPortraitOnly>
            <p>{formatDate(milestone.date)}</p>
            {milestone.name && (
              <ReactMarkdown className={styles.name} source={milestone.name} />
            )}
            <p>{milestone.responsible_authority}</p>
            <a href={milestone.data_source_link}>Data source</a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

class Milestones extends PureComponent {
  render() {
    const { policyCode, milestones } = this.props;

    return (
      <div className={styles.page}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>Milestones</div>
        </div>
        {milestones && table(milestones)}
        <ClimatePolicyProvider params={{ policyCode }} />
      </div>
    );
  }
}

Milestones.propTypes = {
  milestones: PropTypes.array,
  policyCode: PropTypes.string
};

Milestones.defaultProps = { milestones: [], policyCode: '' };

export default Milestones;

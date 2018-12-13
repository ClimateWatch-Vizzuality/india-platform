import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ClimatePolicyProvider from 'providers/climate-policy-provider';
import { Icon } from 'cw-components';
import iconInfo from 'assets/icons/info';

import styles from './milestones-styles';

// const formatDate = date => DateTime.fromISO(date).toFormat('dd/M/yyyy');
// const renderInfoIcon = () => <InfoButton dark slugs="" />;
const table = milestones => (
  <table className={styles.table}>
    <tbody>
      {milestones.map(milestone => (
        <tr key={`${milestone.name}`} className={styles.row}>
          <td className={cx(styles.statusColumn, styles.cell)}>
            {milestone.status}
            <Icon icon={iconInfo} theme={{ icon: cx(styles.statusIcon) }} />
          </td>
          <td className={cx(styles.cell)}>
            {milestone.name && <ReactMarkdown source={milestone.name} />}
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
          <div className={styles.title}>
            Milestones
          </div>
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

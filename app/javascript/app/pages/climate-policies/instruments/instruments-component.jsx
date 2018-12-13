import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ClimatePoliciesProvider from 'providers/climate-policies-provider';
import ClimatePolicyProvider from 'providers/climate-policy-provider';
import { Accordion, Icon } from 'cw-components';
import openInNew from 'assets/icons/open_in_new';

import styles from './instruments-styles';

const columnNames = {
  title: 'Title',
  policy_status: 'Policy status',
  key_milestones: 'Key milestones dates',
  implementation_entities: 'Implementation entity',
  broader_context: 'The broader context'
};

const handleOnClick = () => window.open('https://www.google.com', '_blank');

const table = instrument => (
  <table key={`${instrument.title}-table`} className={styles.table}>
    <tbody>
      {Object.keys(columnNames).map(column => (
        <tr
          key={`${instrument.title}-${instrument[column]}-${column}-row`}
          className={styles.row}
        >
          <td className={cx(styles.nameColumn, styles.cell)}>
            {columnNames[column]}
          </td>
          <td className={cx(styles.cell)}>
            {
              instrument[column] &&
                <ReactMarkdown source={instrument[column]} />
            }
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

class Instruments extends PureComponent {
  constructor() {
    super();
    this.state = { openSlug: '' };
  }

  handleAccordionOnClick = slug => {
    const { openSlug } = this.state;
    this.setState({ openSlug: openSlug === slug ? 'none' : slug });
  };

  render() {
    const { policyCode, instruments } = this.props;
    const { openSlug } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>
            Policy Instruments
          </div>
        </div>
        {
          instruments && instruments && (
          <Accordion
            loading={false}
            data={instruments}
            openSlug={openSlug}
            handleOnClick={this.handleAccordionOnClick}
            theme={{ accordion: styles.accordion }}
          >
            {instruments.map(instrument => table(instrument))}
          </Accordion>
            )
        }
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
        <ClimatePolicyProvider params={{ policyCode }} />
      </div>
    );
  }
}

Instruments.propTypes = {
  instruments: PropTypes.array,
  policyCode: PropTypes.string
};

Instruments.defaultProps = { instruments: [], policyCode: '' };

export default Instruments;

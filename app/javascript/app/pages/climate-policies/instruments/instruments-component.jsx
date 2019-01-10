import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import cx from 'classnames';
import DateTime from 'luxon/src/datetime';
import ClimatePolicyProvider from 'providers/climate-policy-provider';
import InfoButton from 'components/info-button';
import { Accordion } from 'cw-components';

import styles from './instruments-styles';

const columnNames = {
  policy_status: 'Policy status',
  key_milestones: 'Key milestones dates',
  implementation_entities: 'Implementation entity',
  broader_context: 'The broader context'
};

const formatDate = date => DateTime.fromISO(date).toFormat('dd/M/yyyy');

const renderInfoIcon = () => <InfoButton dark slugs="" />;

const table = instrument => (
  <React.Fragment key={`${instrument.title}-table`}>
    <div className={styles.header}>
      <span className={styles.date}>
        Last update: {formatDate(instrument.updated_at)}
      </span>
      {renderInfoIcon()}
    </div>
    <table className={styles.table}>
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
  </React.Fragment>
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
                theme={{
                  title: styles.accordionTitle,
                  header: styles.accordionHeader
                }}
              >
                {instruments.map(instrument => table(instrument))}
              </Accordion>
            )
        }
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

import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import cx from 'classnames';
import DateTime from 'luxon/src/datetime';
import ClimatePolicyProvider from 'providers/climate-policy-provider';
import InfoButton from 'components/info-button';
import { Accordion } from 'cw-components';

import styles from './indicators-styles';

const columnNames = {
  attainment_date: 'Date of attainment:',
  value: 'Indicator value:',
  responsible_authority: 'Responsible authority:',
  data_source_link: 'Data source:',
  tracking_frequency: 'Tracking frequency:',
  tracking_notes: 'Notes on tracking methods:',
  status: 'Status:',
  sources: 'Sources:'
};

const isLink = columnName => columnName === 'data_source_link';

const formatDate = date => DateTime.fromISO(date).toFormat('dd/M/yyyy');

const renderInfoIcon = () => <InfoButton dark slugs="" />;

const handleOpenLink = link => window.open(link, '_blank');

const table = indicator => (
  <React.Fragment key={`${indicator.title}-table`}>
    <div className={styles.header}>
      <span className={styles.date}>
        Last update: {formatDate(indicator.updated_at)}
      </span>
      {renderInfoIcon()}
    </div>
    <table className={styles.table}>
      <tbody>
        {Object.keys(columnNames).map(column => (
          <tr
            key={`${indicator.title}-${indicator[column]}-${column}-row`}
            className={styles.row}
          >
            <td className={cx(styles.nameColumn, styles.cell)}>
              {columnNames[column]}
            </td>
            <td className={cx(styles.cell)}>
              {
                indicator[column] &&
                  (isLink(column)
                    ? (
                      <button
                        type="button"
                        onClick={() => handleOpenLink(indicator[column])}
                        className={styles.link}
                      >
                      Link
                      </button>
)
                    : <ReactMarkdown source={indicator[column]} />)
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </React.Fragment>
);

class Indicators extends PureComponent {
  constructor() {
    super();
    this.state = { openSlug: 'none', openSecondLevelAccordionSlug: 'none' };
  }

  handleAccordionOnClick = slug => {
    const { openSlug } = this.state;
    this.setState({ openSlug: openSlug === slug ? 'none' : slug });
  };

  handleSecondAccordionOnClick = slug => {
    const { openSecondLevelAccordionSlug } = this.state;
    this.setState({
      openSecondLevelAccordionSlug: openSecondLevelAccordionSlug === slug
        ? 'none'
        : slug
    });
  };

  render() {
    const { policyCode, indicators } = this.props;
    const { openSlug, openSecondLevelAccordionSlug } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>
            Indicators
          </div>
        </div>
        {
          indicators && indicators && (
          <Accordion
            loading={false}
            data={indicators}
            openSlug={openSlug}
            handleOnClick={this.handleAccordionOnClick}
            theme={{
                  title: styles.accordionTitle,
                  header: styles.accordionHeader
                }}
          >
            {indicators.map(indicator => (
              <Accordion
                loading={false}
                data={indicator.content}
                openSlug={openSecondLevelAccordionSlug}
                handleOnClick={this.handleSecondAccordionOnClick}
                theme={{
                      title: styles.secondAccordionTitle,
                      header: styles.secondAccordionHeader
                    }}
              >
                {indicator.content.map(ind => table(ind))}
              </Accordion>
                ))}
          </Accordion>
            )
        }
        <ClimatePolicyProvider params={{ policyCode }} />
      </div>
    );
  }
}

Indicators.propTypes = {
  indicators: PropTypes.array,
  policyCode: PropTypes.string
};

Indicators.defaultProps = { indicators: [], policyCode: '' };

export default Indicators;

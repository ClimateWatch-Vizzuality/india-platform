import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import ClimatePolicyProvider from 'providers/climate-policy-provider';
import InfoButton from 'components/info-button';
import { Accordion } from 'cw-components';
import { formatDate } from 'utils';

import styles from './indicators-styles';

const columnNames = {
  attainment_date: 'Date of attainment:',
  target_text: 'Target:',
  responsible_authority: 'Responsible authority:',
  tracking_frequency: 'Tracking frequency:',
  tracking_notes: 'Notes on tracking methods:',
  status: 'Status:',
  sources: 'Sources:'
};

const columnValueRenderers = {
  sources: sources => sources.map(source => (
    <div key={source.code}>
      <a
        href={source.link}
        alt={source.code}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {source.code}
      </a>
    </div>
  ))
};
const columnValueDefaultRenderer = value => <ReactMarkdown source={value} />;

const renderColumnValue = (indicator, column) => {
  const value = indicator[column];
  if (isEmpty(value)) return 'n/a';
  const renderer = columnValueRenderers[column];
  if (renderer) return renderer(value);
  return columnValueDefaultRenderer(value);
};

const renderInfoIcon = () => <InfoButton dark slugs="" />;

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
              {renderColumnValue(indicator, column)}
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
          indicators && (
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
            {indicators.map(({ content }) => (
              <Accordion
                loading={false}
                data={content}
                openSlug={openSecondLevelAccordionSlug}
                handleOnClick={this.handleSecondAccordionOnClick}
                theme={{
                      title: styles.secondAccordionTitle,
                      header: styles.secondAccordionHeader
                    }}
              >
                {content.map(ind => table(ind))}
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

import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
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
  source_ids: 'Sources:'
};

const columnValueRenderers = {
  source_ids: (sourceIds, sources) =>
    sourceIds.map(sourceId => {
      const source = sources && sources.find(s => s.id === sourceId);
      return (
        source && (
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
        )
      );
    })
};
const columnValueDefaultRenderer = value => (
  <ReactMarkdown source={value} escapeHtml={false} />
);

const renderColumnValue = (indicator, column, sources) => {
  const isSourcesColumn = column === 'source_ids';
  const value = indicator[column];
  if (isEmpty(value) && !isSourcesColumn) return 'n/a';
  const renderer = columnValueRenderers[column];
  if (renderer && isSourcesColumn) {
    return renderer(value, sources).length ? renderer(value, sources) : 'n/a';
  }
  if (renderer) return renderer(value);
  return columnValueDefaultRenderer(value);
};

const renderInfoIcon = (indicator, sources) => {
  const sourceIds = indicator.source_ids;
  const indicatorSources = sourceIds.map(
    sourceId => sources && sources.find(s => s.id === sourceId)
  );
  const codes = indicatorSources.map(source => source.code);
  const infoModalData = {
    data: indicatorSources,
    title: 'Sources',
    tabTitles: codes
  };
  return <InfoButton dark infoModalData={infoModalData} />;
};

const table = (indicator, sources) => (
  <React.Fragment key={`${indicator.title}-table`}>
    <div className={styles.header}>
      <span className={styles.date}>
        Last update: {formatDate(indicator.updated_at)}
      </span>
      {renderInfoIcon(indicator, sources)}
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
              {renderColumnValue(indicator, column, sources)}
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
      openSecondLevelAccordionSlug:
        openSecondLevelAccordionSlug === slug ? 'none' : slug
    });
  };

  render() {
    const { policyCode, indicators, sources } = this.props;
    const { openSlug, openSecondLevelAccordionSlug } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>Indicators</div>
        </div>
        {indicators && (
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
                {content.map(ind => table(ind, sources))}
              </Accordion>
            ))}
          </Accordion>
        )}
        <ClimatePolicyProvider params={{ policyCode }} />
      </div>
    );
  }
}

Indicators.propTypes = {
  indicators: PropTypes.array,
  policyCode: PropTypes.string,
  sources: PropTypes.array
};

Indicators.defaultProps = { indicators: [], policyCode: '', sources: [] };

export default Indicators;

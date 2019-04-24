import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import PropTypes from 'prop-types';
import cx from 'classnames';
import DateTime from 'luxon/src/datetime';
import ClimatePolicyProvider from 'providers/climate-policy-provider';
import InfoButton from 'components/info-button';
import { Accordion } from 'cw-components';
import isEmpty from 'lodash/isEmpty';

import styles from './instruments-styles';

const columnNames = {
  description: 'Description',
  policy_status: 'Policy status',
  key_milestones: 'Key milestone dates',
  implementation_entities: 'Implementation entity',
  broader_context: 'Broader context',
  source_ids: 'Sources:'
};

const formatDate = date => DateTime.fromISO(date).toFormat('dd/M/yyyy');

const renderInfoIcon = (instrument, sources) => {
  const sourceIds = instrument.source_ids;
  const instrumentSources = sourceIds
    .map(sId => sources && sources.find(s => s.id === sId))
    .filter(s => s)
    .map(({ code, name, description, link }) => ({ code, name, description, link }));
  const codes = instrumentSources.map(source => source.code);
  const infoModalData = {
    data: instrumentSources,
    title: 'Sources',
    tabTitles: codes
  };
  return <InfoButton dark infoModalData={infoModalData} />;
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

const renderColumnValue = (indicator, column, sources) => {
  const isSourcesColumn = column === 'source_ids';
  const value = indicator[column];
  if (isEmpty(value) && !isSourcesColumn) return 'n/a';
  const renderer = columnValueRenderers[column];
  if (renderer && isSourcesColumn) {
    return renderer(value, sources).length ? renderer(value, sources) : 'n/a';
  }
  if (renderer) return renderer(value);
  return <ReactMarkdown source={value} escapeHtml={false} />;
};

const table = (instrument, sources) => (
  <React.Fragment key={`${instrument.title}-table`}>
    <div className={styles.header}>
      <span className={styles.date}>Last update: {formatDate(instrument.updated_at)}</span>
      {renderInfoIcon(instrument, sources)}
    </div>
    <table className={styles.table}>
      <tbody>
        {Object.keys(columnNames).map(column => (
          <tr
            key={`${instrument.title}-${instrument[column]}-${column}-row`}
            className={styles.row}
          >
            <td className={cx(styles.nameColumn, styles.cell)}>{columnNames[column]}</td>
            <td className={cx(styles.cell)}>{renderColumnValue(instrument, column, sources)}</td>
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
    const { policyCode, instruments, sources } = this.props;
    const { openSlug } = this.state;
    return (
      <div className={styles.page}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>Policy Instruments</div>
        </div>
        {instruments && (
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
            {instruments.map(instrument => table(instrument, sources))}
          </Accordion>
        )}
        <ClimatePolicyProvider params={{ policyCode }} />
      </div>
    );
  }
}

Instruments.propTypes = {
  instruments: PropTypes.array,
  policyCode: PropTypes.string,
  sources: PropTypes.array
};

Instruments.defaultProps = { instruments: [], policyCode: '', sources: [] };

export default Instruments;

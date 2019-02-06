import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import startCase from 'lodash/startCase';
import styles from './metadata-text-styles.scss';

const SHOW_KEYS = [
  'title',
  'source_organization',
  'learn_more_link',
  'citation',
  'notes'
];
const URLS = [ 'learn_more_link' ];

const renderMetadataValue = (key, data, emptyText) => {
  if (!data) {
    return (
      <span className={styles.empty}>
        {emptyText}
      </span>
    );
  }

  if (URLS.includes(key)) {
    return (
      <a className={styles.link} href={data}>
        {data}
      </a>
    );
  }

  return <span>{data}</span>;
};

const MetadataProp = ({ id, title, data, emptyText }) => (
  <p className={styles.text}>
    <span className={styles.textHighlight}>
      {startCase(title)}:
    </span>
    {' '}
    {renderMetadataValue(id, data, emptyText)}
  </p>
);
MetadataProp.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  emptyText: PropTypes.string.isRequired,
  data: PropTypes.node
};
MetadataProp.defaultProps = { data: null };

class MetadataText extends PureComponent {
  renderMetadataProps() {
    const { data } = this.props;

    if (!data) return null;

    return Object
      .keys(data)
      .sort(a => SHOW_KEYS.indexOf(a))
      .filter(key => SHOW_KEYS.includes(key))
      .map(key => (
        <MetadataProp
          key={key}
          id={key}
          title={startCase(key)}
          data={data[key]}
          emptyText="Not specified"
        />
      ));
  }

  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, className } = this.props;

    const shortTitle = data.short_title;

    return (
      <div key={shortTitle} className={cx(styles.textContainer, className)}>
        {this.renderMetadataProps()}
      </div>
    );
  }
}

MetadataText.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string
};

MetadataText.defaultProps = { data: {}, className: null };

export default MetadataText;

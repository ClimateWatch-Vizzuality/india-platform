import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import startCase from 'lodash/startCase';
import castArray from 'lodash/castArray';
import isArray from 'lodash/isArray';
import flatMap from 'lodash/flatMap';
import styles from './metadata-text-styles.scss';

const KEYS_BLACKLIST = [ 'short_title' ];
const URLS = [ 'learn_more_link', 'url' ];

const link = (title, href) => (
  <a
    className={styles.link}
    href={href}
    alt={title}
    target="_blank"
    rel="noopener noreferrer"
  >
    {title}
  </a>
);

const renderMetadataValue = (key, data, emptyText) => {
  if (!data) {
    return (
      <span className={styles.empty}>
        {emptyText}
      </span>
    );
  }

  if (key === 'Link') {
    return link('Show info page', data);
  }

  if (URLS.includes(key)) {
    return link(data, data);
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

    return flatMap(
      castArray(data),
      d => Object
        .keys(d)
        .filter(key => !KEYS_BLACKLIST.includes(key))
        .filter(key => !isArray(d[key]))
        .map(key => (
          <MetadataProp
            key={`${d.short_title}_${key}`}
            id={key}
            title={startCase(key)}
            data={d[key]}
            emptyText="Not specified"
          />
        ))
    );
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

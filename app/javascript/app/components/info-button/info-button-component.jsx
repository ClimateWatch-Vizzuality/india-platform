import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'cw-components';
import iconInfo from 'assets/icons/info';
import ReactTooltip from 'react-tooltip';
import ModalMetadata from 'components/modal-metadata';
import styles from './info-button-styles.scss';

class InfoButton extends PureComponent {
  handleInfoClick = () => {
    const { slugs, setModalMetadata } = this.props;
    if (slugs) {
      setModalMetadata({ slugs, open: true });
    }
  };

  render() {
    const { className } = this.props;
    return (
      <div className={className}>
        <div data-for="blueTooltip" data-tip="Information">
          <Icon
            alt="info"
            icon={iconInfo}
            onClick={this.handleInfoClick}
            theme={{ icon: styles.icon }}
          />
        </div>
        <ReactTooltip
          id="blueTooltip"
          effect="solid"
          className="global_INDTooltip"
        />
        <ModalMetadata />
      </div>
    );
  }
}

InfoButton.propTypes = {
  className: PropTypes.object,
  slugs: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
  setModalMetadata: PropTypes.func.isRequired
};

InfoButton.defaultProps = { className: {}, slugs: null };

export default InfoButton;

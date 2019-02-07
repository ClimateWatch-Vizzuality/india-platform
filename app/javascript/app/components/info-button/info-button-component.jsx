import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'cw-components';
import iconInfo from 'assets/icons/info';
import darkInfo from 'assets/icons/info-fill';
import ReactTooltip from 'react-tooltip';
import ModalMetadata from 'components/modal-metadata';
import { handleAnalytics } from 'utils/analytics';
import styles from './info-button-styles.scss';

class InfoButton extends PureComponent {
  handleInfoClick = () => {
    const { slugs, setModalMetadata, infoModalData } = this.props;
    if (slugs || infoModalData) {
      handleAnalytics('Info Window', 'Open', slugs);
      setModalMetadata({ slugs, open: true });
    }
  };

  render() {
    const { className, theme, dark, infoModalData } = this.props;
    return (
      <div className={className}>
        <div data-for="blueTooltip" data-tip="Information">
          <Icon
            alt="info"
            icon={dark ? darkInfo : iconInfo}
            onClick={this.handleInfoClick}
            theme={{ icon: cx(styles.icon, theme.icon) }}
          />
        </div>
        <ReactTooltip
          id="blueTooltip"
          effect="solid"
          className="global_INDTooltip"
        />
        <ModalMetadata
          data={infoModalData && infoModalData.data}
          title={infoModalData && infoModalData.title}
          tabTitles={infoModalData && infoModalData.tabTitles}
        />
      </div>
    );
  }
}

InfoButton.propTypes = {
  className: PropTypes.object,
  theme: PropTypes.shape({ icon: PropTypes.string }),
  dark: PropTypes.bool,
  slugs: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
  setModalMetadata: PropTypes.func.isRequired,
  infoModalData: PropTypes.shape({
    data: PropTypes.array,
    title: PropTypes.string,
    tabTitles: PropTypes.arrayOf(PropTypes.string)
  })
};

InfoButton.defaultProps = {
  className: {},
  slugs: null,
  theme: {},
  dark: false,
  infoModalData: undefined
};

export default InfoButton;

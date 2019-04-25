import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'cw-components';
import iconInfo from 'assets/icons/info';
import darkInfo from 'assets/icons/info-fill';
import ReactTooltip from 'react-tooltip';
import ModalMetadata from 'components/modal-metadata/modal-metadata-component';
import { handleAnalytics } from 'utils/analytics';
import styles from './info-button-styles.scss';

class InfoButton extends PureComponent {
  constructor() {
    super();
    this.state = { isOpen: false };
  }

  handleInfoClick = () => {
    const { infoModalData } = this.props;
    if (infoModalData) {
      this.setState({ isOpen: !this.setState.isOpen });
      const slugString = infoModalData.tabTitles.join(',');
      handleAnalytics('Info Window', 'Open', slugString);
    }
  };

  render() {
    const { className, theme, dark, infoModalData } = this.props;
    const { isOpen } = this.state;
    return (
      <div className={className}>
        <div
          data-for="blueTooltip"
          data-tip={(infoModalData && infoModalData.title) || 'Information'}
        >
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
        {isOpen && (
          <ModalMetadata
            isOpen={isOpen}
            data={infoModalData && infoModalData.data}
            title={infoModalData && infoModalData.title}
            tabTitles={infoModalData && infoModalData.tabTitles}
            onRequestClose={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

InfoButton.propTypes = {
  className: PropTypes.object,
  theme: PropTypes.shape({ icon: PropTypes.string }),
  dark: PropTypes.bool,
  infoModalData: PropTypes.shape({
    data: PropTypes.array,
    title: PropTypes.string,
    tabTitles: PropTypes.arrayOf(PropTypes.string)
  })
};

InfoButton.defaultProps = {
  className: {},
  theme: {},
  dark: false,
  infoModalData: undefined
};

export default InfoButton;

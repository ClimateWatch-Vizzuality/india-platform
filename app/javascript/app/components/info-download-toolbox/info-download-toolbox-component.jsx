import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ButtonGroup, Button, Icon } from 'cw-components';
import iconInfo from 'assets/icons/info';
import downloadIcon from 'assets/icons/download';
import buttonThemes from 'styles/themes/button';
import ReactTooltip from 'react-tooltip';
import ModalMetadata from 'components/modal-metadata';
import DownloadMenu from 'components/download-menu';
import { handleAnalytics } from 'utils/analytics';
import styles from './info-download-toolbox-styles.scss';

const { API_URL } = process.env;

const getURL = downloadUri =>
  downloadUri.startsWith('http') ? downloadUri : `${API_URL}/${downloadUri}`;

class InfoDownloadToolbox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { opened: false };
  }

  handleClickOutside = () => {
    this.setState({ opened: false });
  };

  handleDownloadClick = () => {
    const { downloadUri } = this.props;
    if (downloadUri) {
      const url = getURL(downloadUri);
      handleAnalytics('Data Download', 'Download', url);
      window.open(url, '_blank');
    }
  };

  handleMenuDownloadClick = option => {
    const isPDF = option.value === 'pdf';
    handleAnalytics('Data Download', 'Download', option.url);

    if (isPDF) {
      window.open(option.url, '_blank');
    } else {
      const url = getURL(option.url);
      window.open(url, '_blank');
    }
  };

  handleInfoClick = () => {
    const { slugs, setModalMetadata } = this.props;

    if (!slugs) return;

    const slugString = Array.isArray(slugs) ? slugs.join(',') : slugs;

    handleAnalytics('Info Window', 'Open', slugString);
    setModalMetadata({ slugs, open: true, customTitle: 'Sources' });
  };

  render() {
    const {
      theme,
      downloadUri,
      className,
      noDownload,
      infoModalData,
      infoTooltipText,
      downloadTooltipText,
      downloadOptions
    } = this.props;

    const { opened } = this.state;

    const renderDownloadButton = () => {
      const isDownloadMenu = downloadOptions && downloadOptions.length > 0;
      return isDownloadMenu ? (
        <React.Fragment>
          <Button
            onClick={() => this.setState({ opened: !opened })}
            theme={{
              button: cx(buttonThemes.outline, styles.button, theme.infobutton)
            }}
          >
            <div
              data-for="blueTooltip"
              data-tip={downloadTooltipText || 'Download chart in .csv'}
            >
              <div className={styles.iconWrapper}>
                <Icon icon={downloadIcon} />
              </div>
            </div>
          </Button>
          <DownloadMenu
            opened={opened}
            options={downloadOptions}
            handleDownload={this.handleMenuDownloadClick}
            handleClickOutside={this.handleClickOutside}
          />
        </React.Fragment>
) : (
  <div
    data-for="blueTooltip"
    data-tip={downloadTooltipText || 'Download chart in .csv'}
  >
    <Button
      onClick={this.handleDownloadClick}
      theme={{
              button: cx(buttonThemes.outline, styles.button, theme.infobutton)
            }}
      disabled={!downloadUri}
    >
      <Icon icon={downloadIcon} />
    </Button>
  </div>
);
    };

    return (
      <ButtonGroup
        theme={{
          wrapper: cx(
            styles.buttonWrapper,
            theme.buttonWrapper,
            className.buttonWrapper
          )
        }}
      >
        <div
          data-for="blueTooltip"
          data-tip={infoTooltipText || 'Chart information'}
        >
          <Button
            onClick={this.handleInfoClick}
            theme={{
              button: cx(buttonThemes.outline, styles.button, theme.infobutton)
            }}
          >
            <Icon icon={iconInfo} />
          </Button>
        </div>
        <div>
          {!noDownload && renderDownloadButton()}
        </div>
        <ReactTooltip
          id="blueTooltip"
          effect="solid"
          className="global_blueTooltip"
        />
        <ModalMetadata
          data={infoModalData && infoModalData.data}
          title={infoModalData && infoModalData.title}
          tabTitles={infoModalData && infoModalData.tabTitles}
        />
      </ButtonGroup>
    );
  }
}

InfoDownloadToolbox.propTypes = {
  theme: PropTypes.shape({
    buttonWrapper: PropTypes.string,
    infobutton: PropTypes.string
  }),
  className: PropTypes.object,
  slugs: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
  downloadUri: PropTypes.string,
  infoModalData: PropTypes.shape({
    data: PropTypes.array,
    title: PropTypes.string,
    tabTitles: PropTypes.arrayOf(PropTypes.string)
  }),
  infoTooltipText: PropTypes.string,
  downloadTooltipText: PropTypes.string,
  setModalMetadata: PropTypes.func.isRequired,
  noDownload: PropTypes.bool,
  downloadOptions: PropTypes.array
};

InfoDownloadToolbox.defaultProps = {
  theme: {},
  className: {},
  slugs: [],
  infoModalData: null,
  downloadUri: null,
  infoTooltipText: null,
  downloadTooltipText: null,
  downloadOptions: [],
  noDownload: false
};

export default InfoDownloadToolbox;

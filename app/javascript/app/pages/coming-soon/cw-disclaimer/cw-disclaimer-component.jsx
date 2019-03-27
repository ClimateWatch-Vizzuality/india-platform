import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button } from 'cw-components';
import button from 'styles/themes/button';
import { GLOBAL_CW_PLATFORM } from 'constants/links';
import styles from './cw-disclaimer-styles.scss';

class CwDisclaimer extends PureComponent {
  handleBtnClick = () => {
    window.open(GLOBAL_CW_PLATFORM, '_blank');
  };

  render() {
    const { text } = this.props;

    return (
      <div className={styles.wrapper}>
        <div className={styles.climateWatch}>
          <span className={styles.bold}>CLIMATE</span>
          WATCH
        </div>
        <div className={styles.description}>{text}</div>
        <Button
          onClick={this.handleBtnClick}
          theme={{ button: cx(button.primary, styles.button) }}
        >
          Explore the global site
        </Button>
      </div>
    );
  }
}
CwDisclaimer.propTypes = { text: PropTypes.string };
CwDisclaimer.defaultProps = { text: '' };

export default CwDisclaimer;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import iconInfo from 'assets/icons/info';
import { Icon } from 'cw-components';
import { TabletLandscape, TabletPortraitOnly } from 'components/responsive';
import styles from './section-title-styles.scss';

class SectionTitle extends PureComponent {
  handleInfoClick = () => {
    const { setOpen } = this.props;
    setOpen(true);
  };

  renderExtraContent() {
    const { extraContent } = this.props;
    return (
      <div className={styles.extraContent}>
        {extraContent}
      </div>
    );
  }

  render() {
    const {
      theme,
      title,
      isSubtitle,
      infoButton,
      className,
      description,
      noMarginBottom
    } = this.props;
    return (
      <React.Fragment>
        <div className={styles.sectionTitleContainer}>
          <h2
            className={cx(
              styles.sectionTitle,
              { [styles.sectionSubtitle]: isSubtitle },
              {
                [styles.sectionContainerNoMarginBottom]: description ||
                  noMarginBottom
              },
              theme.sectionTitle,
              className
            )}
          >
            {title}
          </h2>
          {
            infoButton && (
            <button
              onClick={this.handleInfoClick}
              className={cx(styles.iconContainer, theme.iconContainer)}
              type="button"
            >
              <Icon icon={iconInfo} />
            </button>
              )
          }
          <TabletLandscape>
            {this.renderExtraContent()}
          </TabletLandscape>
        </div>
        {
          description &&
            (
              <p
                className={styles.sectionDescription}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )
        }
        <TabletPortraitOnly>
          {this.renderExtraContent()}
        </TabletPortraitOnly>
      </React.Fragment>
    );
  }
}

SectionTitle.propTypes = {
  theme: PropTypes.shape({ sectionTitle: PropTypes.string }),
  title: PropTypes.string,
  infoButton: PropTypes.bool,
  extraContent: PropTypes.node,
  className: PropTypes.string,
  isSubtitle: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  description: PropTypes.string,
  noMarginBottom: PropTypes.bool
};

SectionTitle.defaultProps = {
  theme: {},
  title: '',
  extraContent: null,
  isSubtitle: false,
  infoButton: false,
  className: null,
  description: '',
  noMarginBottom: false
};

export default SectionTitle;

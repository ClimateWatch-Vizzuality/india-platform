import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SectionTitle from 'components/section-title';
import { Icon, Button } from 'cw-components';
import yellowWriLogo from 'assets/yellow-wri-logo';
import { WRI_WEBSITE } from 'constants/links';
import button from 'styles/themes/button';
import StoriesProvider from 'providers/stories-provider';
import styles from './stories-styles.scss';

class Stories extends PureComponent {
  handleBtnClick = () => {
    window.open(WRI_WEBSITE, '_blank');
  };

  handleStoryClick = link => {
    window.open(link, '_blank');
  };

  render() {
    const { stories } = this.props;
    return (
      <div className={styles.wrapper}>
        <SectionTitle title="Highlighted Stories" />
        <div className={styles.grid}>
          {stories &&
            stories.map((story, index) => {
              const i = index + 1;
              const childClassName = `child-${i}`;
              return (
                <div
                  key={story.title}
                  role="link"
                  tabIndex={0}
                  className={cx(styles.story, styles[childClassName])}
                  onClick={() => this.handleStoryClick(story.link)}
                  onKeyDown={() => this.handleStoryClick(story.link)}
                  style={{
                    backgroundImage: `url(${story.background_image_url})`
                  }}
                >
                  <div className={styles.storyDate}>{story.date}</div>
                  <div className={styles.storyTitle}>{story.title}</div>
                  <div className={styles.storyDescription}>
                    {story.description}
                  </div>
                  <div className={styles.logoContainer}>
                    <Icon
                      alt="Wri logo"
                      icon={yellowWriLogo}
                      theme={{ icon: styles.icon }}
                    />
                    <span className={styles.text}>
                      By World Resources Institute
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
        <Button
          onClick={this.handleBtnClick}
          theme={{ button: cx(button.primary, styles.button) }}
        >
          More Stories
        </Button>
        <StoriesProvider />
      </div>
    );
  }
}

Stories.propTypes = { stories: PropTypes.array };

Stories.defaultProps = { stories: [] };

export default Stories;

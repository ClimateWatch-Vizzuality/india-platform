import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Input, CheckInput, Icon, Tag } from 'cw-components';
import searchIcon from 'assets/icons/search.svg';
import arrowIcon from 'assets/icons/arrow.svg';

import checkboxTheme from 'styles/themes/checkBox.scss';
import styles from './search-categories-box-styles.scss';

class SearchCategoriesBoxComponent extends PureComponent {
  constructor(props) {
    super(props);
    const { tabs } = this.props;
    this.state = { selectedTab: tabs[0], open: false };
  }

  handleTabChange = event => {
    const tab = event.target.textContent;
    const { tabs } = this.props;
    this.setState({ selectedTab: tabs.filter(t => t.name === tab)[0] });
  };

  handleBoxToggle = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render() {
    const {
      onSearchChange,
      placeholder,
      tabs,
      checkBoxes,
      foldedFilters,
      plainFilters,
      onCheckboxChange,
      handleTagRemove,
      handleAllTagsRemove
    } = this.props;
    const { selectedTab, open } = this.state;
    const arrowIconTheme = open ? styles.arrowIconClose : styles.arrowIconOpen;
    return (
      <div className={styles.container}>
        <div className={styles.searchInput}>
          <Input
            onChange={value => onSearchChange(value)}
            placeholder={placeholder}
            theme={{ input: styles.inputWrapper }}
            icon={null}
          />
          <Icon
            icon={searchIcon}
            theme={{ icon: styles.searchIcon }}
            onClick={null}
          />
          <Icon
            icon={arrowIcon}
            theme={{ icon: arrowIconTheme }}
            onClick={this.handleBoxToggle}
          />
        </div>
        {
          open && (
          <div className={styles.boxWrapper}>
            <div className={styles.tabsContainer}>
              {tabs.map(tab => (
                <div
                  key={tab.slug}
                  className={cx(styles.tab, {
                        [styles.active]: selectedTab.slug === tab.slug
                      })}
                >
                  <button
                    type="button"
                    className={styles.tabName}
                    onClick={this.handleTabChange}
                  >
                    {tab.name}
                  </button>
                  <span className={styles.tabIndex}>
                    {
                          foldedFilters &&
                            foldedFilters[tab.slug] &&
                            (foldedFilters[tab.slug].length || '')
                        }
                  </span>
                </div>
                  ))}
            </div>
            <div className={styles.optionsContainer}>
              {checkBoxes[selectedTab.slug].map(option => (
                <div key={option} className={styles.option}>
                  <CheckInput
                    key={option}
                    id={option}
                    toggleFirst
                    onChange={e => onCheckboxChange(e, selectedTab)}
                    theme={checkboxTheme}
                    label={option}
                    checked={
                          foldedFilters &&
                            foldedFilters[selectedTab.slug] &&
                            foldedFilters[selectedTab.slug].some(
                              q => q === option
                            )
                        }
                  />
                </div>
                  ))}
            </div>
          </div>
            )
        }
        {
          !open && plainFilters && (
          <div className={styles.tagsWrapper}>
            {plainFilters.map(f => (
              <Tag
                key={f}
                label={f}
                canRemove
                theme={styles}
                onRemove={handleTagRemove}
              />
                ))}
            <Tag
              label="Clear all"
              theme={{ tag: styles.clearTag }}
              canRemove
              onRemove={handleAllTagsRemove}
            />
          </div>
            )
        }
      </div>
    );
  }
}

SearchCategoriesBoxComponent.propTypes = {
  placeholder: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  plainFilters: PropTypes.arrayOf(PropTypes.string),
  checkBoxes: PropTypes.shape({}).isRequired,
  foldedFilters: PropTypes.shape({}),
  onSearchChange: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  handleTagRemove: PropTypes.func.isRequired,
  handleAllTagsRemove: PropTypes.func.isRequired
};

SearchCategoriesBoxComponent.defaultProps = {
  foldedFilters: null,
  plainFilters: null
};

export default SearchCategoriesBoxComponent;

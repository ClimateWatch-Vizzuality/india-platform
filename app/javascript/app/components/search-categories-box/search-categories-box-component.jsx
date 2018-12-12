import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Input } from 'cw-components';

import styles from './search-categories-box-styles.scss';

class SearchCategoriesBoxComponent extends PureComponent {
  constructor(props) {
    super(props);
    const { tabs } = this.props;
    this.state = { selectedTab: tabs[0] };
  }

  handleTabChange = event => {
    const tab = event.target.textContent;
    const { tabs } = this.props;
    this.setState({ selectedTab: tabs.filter(t => t.name === tab)[0] });
  };

  render() {
    const {
      onSearchChange,
      placeholder,
      tabs,
      checkBoxes,
      foldedFilters,
      onCheckboxChange
    } = this.props;
    const { selectedTab } = this.state;
    return (
      <div className={styles.container}>
        <Input
          onChange={value => onSearchChange(value)}
          placeholder={placeholder}
          theme={{ input: styles.inputWrapper }}
        />
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
                <label htmlFor={option} className={styles.inputCombo}>
                  <input
                    type="checkbox"
                    name={option}
                    id={option}
                    onChange={e => onCheckboxChange(e, selectedTab)}
                    className={styles.checkbox}
                    checked={
                      foldedFilters &&
                        foldedFilters[selectedTab.slug] &&
                        foldedFilters[selectedTab.slug].some(q => q === option)
                    }
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

SearchCategoriesBoxComponent.propTypes = {
  placeholder: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  checkBoxes: PropTypes.shape({}).isRequired,
  foldedFilters: PropTypes.shape({}),
  onSearchChange: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired
};

SearchCategoriesBoxComponent.defaultProps = { foldedFilters: null };

export default SearchCategoriesBoxComponent;

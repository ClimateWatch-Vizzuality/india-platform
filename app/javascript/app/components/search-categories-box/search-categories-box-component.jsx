import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { Input } from 'cw-components';

import styles from './search-categories-box-styles.scss';

class SearchCategoriesBoxComponent extends PureComponent {
  constructor(props) {
    super(props);
    const { tabs } = this.props;
    this.state = { selectedTab: tabs[0] };
  }

  handleCheckboxChange = event => {
    const { onFilterChange, query } = this.props;
    const { selectedTab } = this.state;
    const key = [ selectedTab.slug ];
    const input = event.target.id;
    const selectedTabFilters = query && query[key];
    const isFilterActive = selectedTabFilters &&
      selectedTabFilters.includes(input);
    let updatedFilters;
    if (isFilterActive) {
      updatedFilters = { ...query, [key]: query[key].filter(f => f !== input) };
    } else {
      updatedFilters = selectedTabFilters
        ? { [key]: [ ...query[key], input ] }
        : { [key]: [ input ] };
    }
    updatedFilters = isEmpty(updatedFilters[key]) ? {} : { ...updatedFilters };
    onFilterChange({ ...updatedFilters }, key);
  };

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
      foldedFilters
    } = this.props;
    const { selectedTab } = this.state;
    return (
      <div className={styles.container}>
        <Input
          onChange={onSearchChange}
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
                    onChange={this.handleCheckboxChange}
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
  query: PropTypes.shape({}),
  foldedFilters: PropTypes.shape({}),
  onSearchChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

SearchCategoriesBoxComponent.defaultProps = {
  query: null,
  foldedFilters: null
};

export default SearchCategoriesBoxComponent;

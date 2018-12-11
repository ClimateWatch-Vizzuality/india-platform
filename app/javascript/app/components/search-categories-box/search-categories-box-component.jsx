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

  handleFilterChange = event => {
    const { onFilterChange, filters } = this.props;
    const { selectedTab } = this.state;
    const input = event.target.id;
    const selectedTabFilters = filters && filters[selectedTab.slug];
    const isFilterActive = selectedTabFilters &&
      selectedTabFilters.includes(input);
    let updatedFilters;
    if (isFilterActive) {
      updatedFilters = {
        ...filters,
        [selectedTab.slug]: filters[selectedTab.slug].filter(f => f !== input)
      };
    } else {
      updatedFilters = selectedTabFilters
        ? { [selectedTab.slug]: [ ...filters[selectedTab.slug], input ] }
        : { [selectedTab.slug]: [ input ] };
    }
    onFilterChange({ ...updatedFilters });
  };

  handleTabChange = event => {
    const tab = event.target.textContent;
    const { tabs } = this.props;
    this.setState({ selectedTab: tabs.filter(t => t.name === tab)[0] });
  };

  render() {
    const { onChange, placeholder, tabs, checkBoxes, filters } = this.props;
    const { selectedTab } = this.state;
    return (
      <div className={styles.container}>
        <Input
          onChange={onChange}
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
                {}
                <p className={styles.tabName} onClick={this.handleTabChange}>
                  {tab.name}
                </p>
                <span className={styles.tabIndex}>
                  {
                    filters &&
                      filters[tab.slug] &&
                      (filters[tab.slug].length || '')
                  }
                </span>
              </div>
            ))}
          </div>
          <div className={styles.optionsContainer}>
            {checkBoxes[selectedTab.slug].map(option => (
              <div key={option} className={styles.option}>
                <label htmlFor={option}>
                  <input
                    type="checkbox"
                    name={option}
                    id={option}
                    onChange={this.handleFilterChange}
                    checked={
                      filters &&
                        filters[selectedTab.slug] &&
                        filters[selectedTab.slug].some(q => q === option)
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
  filters: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

SearchCategoriesBoxComponent.defaultProps = { filters: null };

export default SearchCategoriesBoxComponent;

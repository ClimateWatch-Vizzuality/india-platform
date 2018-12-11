import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Input } from 'cw-components';

import styles from './search-categories-box-styles.scss'

class SearchCategoriesBoxComponent extends PureComponent {
  constructor(props) {
    super(props)
    const { tabs } = this.props;
    this.state = {
      selectedTab: tabs[0],
      filter: []
    }
  }

  handleFilterChange = event => {
    const { onFilterChange, query } = this.props;
    const { selectedTab } = this.state;
    const input = event.target.id;
    const active = event.target.checked;
    console.log(query)
    console.log(input)
    console.log(selectedTab.slug)
    const filter = query ? [ ...query[selectedTab.slug], input] : [input];
    onFilterChange({ [selectedTab.slug]: filter });
  }

  handleTabChange = event => {
    const tab = event.target.textContent
    const { tabs } = this.props;
    this.setState({selectedTab: tabs.filter(t => t.name === tab)[0]})
  }

  render() {
    const { onChange, placeholder, tabs, checkBoxes, handleFilterChange } = this.props;
    const { selectedTab } = this.state;
    return (
      <div className={styles.container}>
        <Input onChange={onChange} placeholder={placeholder} theme={{input: styles.inputWrapper}} />
        <div className={styles.boxWrapper}>
          <div className={styles.tabsContainer}>
            {tabs.map(tab => (
              <div
                key={tab.slug}
                className={cx(styles.tab, {[styles.active]: selectedTab.slug === tab.slug })}
              >
                <p className={styles.tabName} onClick={this.handleTabChange}>{tab.name}</p>
                <span className={styles.tabIndex}>2</span>
              </div>
              ))
            }
          </div>
          <div className={styles.optionsContainer}>
            {checkBoxes[selectedTab.slug].map(option => (
              <div key={option} className={styles.option}>
                <label htmlFor={option}>
                  <input type='checkbox' name={option} id={option} onChange={this.handleFilterChange} />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

SearchCategoriesBoxComponent.propTypes = {
  placeholder: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  checkBoxes: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired
};

export default SearchCategoriesBoxComponent;

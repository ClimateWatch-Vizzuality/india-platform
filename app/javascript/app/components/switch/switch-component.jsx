import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'cw-components';
import styles from './switch-styles.scss';

const SwitchComponent = ({ options, value, handleChange }) => (
  <div className={styles.switch}>
    <div className="switch-container">
      <Switch
        options={options}
        onClick={handleChange}
        selectedOption={String(value)}
        theme={{
          wrapper: styles.switchWrapper,
          option: styles.option,
          checkedOption: styles.checkedOption
        }}
      />
    </div>
  </div>
);

SwitchComponent.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired
};

SwitchComponent.defaultProps = { value: null };

export default SwitchComponent;

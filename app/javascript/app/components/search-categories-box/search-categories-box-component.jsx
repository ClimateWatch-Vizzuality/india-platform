import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'cw-components';

const SearchCategoriesBoxComponent = ({ onChange, placeholder }) => (
  <Input onChange={onChange} placeholder={placeholder} />
);

SearchCategoriesBoxComponent.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default SearchCategoriesBoxComponent;

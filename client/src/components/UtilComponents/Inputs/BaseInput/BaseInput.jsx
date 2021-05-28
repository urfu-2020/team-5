import React from "react";
import PropTypes from 'prop-types';

import './base-input.css';

export const BaseInput = ({className, value, onChange, ...otherProps}) => {
  return (
    <input
      onChange={onChange}
      value={value}
      className={`
        base-input
        ${className ? className : ''}
      `}
      {...otherProps}
    />
  );
};

BaseInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

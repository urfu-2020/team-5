import React from 'react';
import PropTypes from 'prop-types';

import './toggle.css';

export const Toggle = ({toggleId, className, checked, disabled, onChange}) => {
  return (
    <div className={`toggle ${className ? className : ''}`}>
      <input
        id={toggleId}
        disabled={disabled}
        type="checkbox"
        className="toggle__input"
        checked={checked}
        onChange={onChange}
      />
      <span className="slider round"/>
    </div>
  );
};


Toggle.propTypes = {
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  toggleId: PropTypes.string.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func
};

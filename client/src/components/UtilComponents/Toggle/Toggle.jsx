import React from 'react';
import PropTypes from 'prop-types';

import './toggle.css';

export const Toggle = ({toggleId, className}) => {
  return (
    <div className={`toggle ${className ? className : ''}`}>
      <input id={toggleId} type="checkbox" className="toggle__input"/>
      <span className="slider round"/>
    </div>
  );
};


Toggle.propTypes = {
  toggleId: PropTypes.string.isRequired,
  className: PropTypes.string
};

import React from 'react';
import PropTypes from 'prop-types';

import './button.css';
import { Ripple } from './Ripple/Ripple';


export const Button = ({children, className, type, ...otherProps}) => {
  return (
    <button className={`button ${className ? className : ''}`} type={type ? type : "button"} {...otherProps}>
      {children}
      <Ripple duration={800} />
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.string
};


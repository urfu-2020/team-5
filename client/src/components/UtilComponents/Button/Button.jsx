import React from 'react';
import PropTypes from 'prop-types';

import './button.css';
import { Ripple } from './Ripple/Ripple';

export const Button = ({Icon, children, className, type, as, ...otherProps}) => {
  const ResAs = as ? as : "button";
  return (
    <ResAs className={`button ${className ? className : ''}`} type={type ? type : "button"} {...otherProps}>
      {Icon}
      {children}
      <Ripple duration={800} />
    </ResAs>
  );
};

Button.propTypes = {
  Icon: PropTypes.element,
  children: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.string,
  as: PropTypes.string
};


import React from 'react';
import PropTypes from 'prop-types';

import './button.css';
import { Ripple } from './Ripple/Ripple';

export const Button = ({children, ...otherProps}) => {

  return (
    <button {...otherProps}>
      {children}
      <Ripple duration={800} />
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired
};


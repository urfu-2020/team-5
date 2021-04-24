import React from 'react';
import PropTypes from 'prop-types';

import './button.css';

export const Button = ({children, ...otherProps}) => {

  return (
    <button {...otherProps}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired
};


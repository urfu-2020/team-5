import React from "react";
import PropTypes from 'prop-types';

import './Spinner.css';

// TODO сделать нормальную крутилку
export const Spinner = ({className, ...otherProps}) => (
  <p className={`spinner ${className ? className : ''}`} {...otherProps}> Loading... </p>
);

Spinner.propTypes = {
  className: PropTypes.string
};

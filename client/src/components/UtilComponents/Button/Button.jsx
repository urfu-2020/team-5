import React from 'react';
import PropTypes from 'prop-types';

import './button.css';
import { Ripple } from './Ripple/Ripple';
import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../../store/slices/appSlice/appSelectors";

export const Button = ({Icon, children, className, type, as, ...otherProps}) => {
  const isDarkTheme = useSelector(selectIsDarkTheme);
  const ResAs = as ? as : "button";
  return (
    <ResAs
      className={`button ${className ? className : ''} ${isDarkTheme ? 'button_dark' : ''}`}
      type={type ? type : "button"} {...otherProps}>
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


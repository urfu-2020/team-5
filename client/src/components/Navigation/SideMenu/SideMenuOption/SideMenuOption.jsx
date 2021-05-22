import React from "react";
import PropTypes from 'prop-types';
import {Button} from "../../../Controls/Button/Button";

import './side-menu-option.css';

export const SideMenuOption = ({Icon, text, children, as, className, ...props}) => {
  return (
    <Button
      className={`side-menu-option ${className}`}
      as={as}
      {...props}
    >
      {Icon}
      {text}
      {children}
    </Button>
  );
};

SideMenuOption.propTypes = {
  Icon: PropTypes.func.isRequired,
  text: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.string,
  className: PropTypes.string
};

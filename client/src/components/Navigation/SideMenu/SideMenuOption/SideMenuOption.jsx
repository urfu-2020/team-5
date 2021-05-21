import React from "react";
import PropTypes from 'prop-types';
import {Button} from "../../../Controls/Button/Button";

import './side-menu-option.css';

export const SideMenuOption = ({Icon, text, children, as}) => {
  return (
    <Button
      className="side-menu-option"
      as={as}
    >
      <Icon />
      {text}
      {children}
    </Button>
  );
};

SideMenuOption.propTypes = {
  Icon: PropTypes.node.isRequired,
  text: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.element
};

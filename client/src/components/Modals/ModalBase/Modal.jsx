import React from "react";
import PropTypes from 'prop-types';

import './modal.css';
import {Overlay} from "../../UtilComponents/Overlay/Overlay";

export const Modal = ({as, className, onOverlayClick, children, ...otherProps}) => {
  const ResAs = as ? as : 'section';

  return (
    <>
      <Overlay onClick={onOverlayClick}/>
      <ResAs role="dialog" className={`modal ${className ? className : ''}`} {...otherProps}>
        {children}
      </ResAs>
    </>
  );
};

Modal.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
  onOverlayClick: PropTypes.func,
  children: PropTypes.node
};

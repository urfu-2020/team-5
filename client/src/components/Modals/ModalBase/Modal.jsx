import React from "react";
import PropTypes from 'prop-types';

import './modal.css';
import {ModalOverlay} from "./ModalOverlay/ModalOverlay";

export const Modal = ({as, className, onOverlayClick, children, ...otherProps}) => {
  const overlayClickHandler = e => {
    if (e.target.classList.contains('modal-overlay'))
      onOverlayClick();
  };

  const ResAs = as ? as : 'section';

  return (
    <>
      <ModalOverlay overlayClickHandler={overlayClickHandler}/>
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

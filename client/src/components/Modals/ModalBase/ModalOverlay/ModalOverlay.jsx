import React from "react";
import PropTypes from 'prop-types';

import './modal-overlay.css';

export const ModalOverlay = ({overlayClickHandler}) => {
  return (
    <div
      tabIndex="-1"
      aria-hidden="true"
      className="modal-overlay"
      onClick={overlayClickHandler}
    />
  );
};

ModalOverlay.propTypes = {
  overlayClickHandler: PropTypes.func
};

import React from "react";
import PropTypes from 'prop-types';

import './overlay.css';

export const Overlay = ({onClick}) => {
  const overlayClickHandler = e => {
    if (e.target.classList.contains('overlay'))
      onClick();
  };

  return (
    <div
      tabIndex="-1"
      aria-hidden="true"
      className="overlay"
      onClick={overlayClickHandler}
    />
  );
};

Overlay.propTypes = {
  onClick: PropTypes.func
};

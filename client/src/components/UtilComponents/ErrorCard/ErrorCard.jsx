import React from 'react';
import PropTypes from 'prop-types';

import './error-card.css';
import {CloseIcon} from "../Icons/CloseIcon";

export const ErrorCard = ({className, errorMessage, onClose}) => {
  return (
    <div className={`error-card ${className ? className : ''}`}>
      <CloseIcon onClick={onClose} className="error-card__close-button" />
      <h4 className="error-card__header"> Ошибка </h4>
      <div className="error-card__body">
        <p className="error-card__message">
          {errorMessage}
        </p>
      </div>
    </div>
  );
};

ErrorCard.propTypes = {
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  onClose: PropTypes.func
};

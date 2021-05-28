import React, {useState} from "react";
import PropTypes from 'prop-types';

import {BaseInput} from "../BaseInput/BaseInput";

export const ErrorOnEmptyInput = ({className, errorMessage, value, onChange, ...otherProps}) => {
  const [hasError, setHasError] = useState(false);
  const [isBlurOnErrorState, blurOnErrorState] = useState(false);

  const handleInputChange = e => {
    const newText = e.target.value;
    onChange(newText);
    if (isBlurOnErrorState && newText === '') {
      setHasError(true);
    } else if (hasError) {
      setHasError(false);
      blurOnErrorState(false);
    }
  };

  const handleBlur = e => {
    if (!isBlurOnErrorState) {
      blurOnErrorState(true);
    }
    if (e.target.value === '') {
      setHasError(true);
    }
  };


  return (
    <>
      <BaseInput
        onBlur={handleBlur}
        onChange={handleInputChange}
        value={value}
        className={`
          error-on-empty-input
          ${hasError ? 'error-on-empty-input_error' : ''}
          ${className ? className : ''}
        `}
        {...otherProps}
      />
      {
        hasError &&
        <p className="new-chat-info-modal__helper-text">{errorMessage}</p>
      }
    </>
  );
};

ErrorOnEmptyInput.propTypes = {
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

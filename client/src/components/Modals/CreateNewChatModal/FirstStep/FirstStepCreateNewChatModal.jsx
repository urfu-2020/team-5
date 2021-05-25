import React, {useState} from "react";
import PropTypes from 'prop-types';
import {NewChatIcon} from "../../../Controls/Icons/NewChatIcon";
import {Button} from "../../../Controls/Button/Button";

import './first-step-create-new-chat-modal.css';


export const FirstStepCreateNewChatModal = ({chatTitle, setChatTitle, setNewChatModalOpen, setStep}) => {
  const [hasError, setHasError] = useState(false);
  const [isBlurOnErrorState, blurOnErrorState] = useState(false);

  const handleInputChange = e => {
    const newText = e.target.value;
    setChatTitle(newText);
    if(isBlurOnErrorState && newText === '') {
      setHasError(true);
    } else if(hasError) {
      setHasError(false);
      blurOnErrorState(false);
    }
  };

  const handleBlur = e => {
    if(!isBlurOnErrorState) {
      blurOnErrorState(true);
    }
    if(e.target.value === '') {
      setHasError(true);
    }
  };

  return (
    <div className="first-step-create-new-chat-modal">
      <div className="first-step-create-new-chat-modal__chat-info">
        <NewChatIcon className="first-step-create-new-chat-modal__chat-avatar default-chat-avatar"/>
        <div className="first-step-create-new-chat-modal__chat-title-input-wrapper">
          <label className="input-chat-title-label" htmlFor="input-chat-title">Название чата:</label>
          <input
            onBlur={handleBlur}
            onChange={handleInputChange}
            value={chatTitle}
            type="text"
            className={`create-new-chat-modal-input ${hasError ? 'create-new-chat-modal-input_error' : ''}`}
            id="input-chat-title"
          />
          {
            hasError &&
            <p className="first-step-create-new-chat-modal__helper-text">Название чата не может быть пустым</p>
          }
        </div>
      </div>
      <div className="first-step-create-new-chat-modal__buttons">
        <Button className="text-button" onClick={() => setNewChatModalOpen(false)}> Отмена </Button>
        <Button
          disabled={chatTitle === ''}
          className="text-button"
          onClick={() => setStep(1)}
        > Далее </Button>
      </div>
    </div>
  );
};

FirstStepCreateNewChatModal.propTypes = {
  chatTitle: PropTypes.string,
  setChatTitle: PropTypes.func,
  setNewChatModalOpen: PropTypes.func,
  setStep: PropTypes.func
};

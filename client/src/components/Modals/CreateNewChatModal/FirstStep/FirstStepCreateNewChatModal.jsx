import React, {useState} from "react";
import PropTypes from 'prop-types';
import {NewChatIcon} from "../../../UtilComponents/Icons/NewChatIcon";
import {Button} from "../../../UtilComponents/Button/Button";

import './first-step-create-new-chat-modal.css';
import {CloseIcon} from "../../../UtilComponents/Icons/CloseIcon";


export const FirstStepCreateNewChatModal = ({
  onKeyDown,
                                              chatTitle,
                                              setChatTitle,
                                              setNewChatModalOpen,
                                              setStep
                                            }) => {
  const [hasError, setHasError] = useState(false);
  const [isBlurOnErrorState, blurOnErrorState] = useState(false);

  const handleInputChange = e => {
    const newText = e.target.value;
    setChatTitle(newText);
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
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      onKeyDown={onKeyDown}
      className="first-step-create-new-chat-modal"
      role="dialog"
      aria-label="Модальное окно создания чата, 1 этап."
      aria-labelledby="input-chat-title"
    >
      <div className="first-step-create-new-chat-modal__chat-info">
        <Button
          className="rounded-button centred-button create-chat-modal__close-icon"
          Icon={<CloseIcon className="svg-button" />}
        />
        <NewChatIcon className="first-step-create-new-chat-modal__chat-avatar default-chat-avatar"/>
        <div className="first-step-create-new-chat-modal__chat-title-input-wrapper">
          <label className="input-chat-title-label" htmlFor="input-chat-title">Введите название чата:</label>
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
  onKeyDown: PropTypes.string,
  chatTitle: PropTypes.string,
  setChatTitle: PropTypes.func,
  setNewChatModalOpen: PropTypes.func,
  setStep: PropTypes.func
};

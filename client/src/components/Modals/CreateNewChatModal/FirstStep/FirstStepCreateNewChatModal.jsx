import React from "react";
import PropTypes from 'prop-types';
import {NewChatIcon} from "../../../Controls/Icons/NewChatIcon";
import {Button} from "../../../Controls/Button/Button";

import './first-step-create-new-chat-modal.css';

export const FirstStepCreateNewChatModal = ({chatTitle, setChatTitle, setNewChatModalOpen, setStep}) => {
  return (
    <div className="first-step-create-new-chat-modal">
      <div className="first-step-create-new-chat-modal__chat-info">
        <NewChatIcon className="first-step-create-new-chat-modal__chat-avatar default-chat-avatar"/>
        <div className="first-step-create-new-chat-modal__chat-title-input-wrapper">
          <label className="input-chat-title-label" htmlFor="input-chat-title">Название чата:</label>
          <input
            onChange={e => setChatTitle(e.target.value)}
            value={chatTitle}
            type="text"
            className="create-new-chat-modal-input"
            id="input-chat-title"
          />
        </div>
      </div>
      <div className="first-step-create-new-chat-modal__buttons">
        <Button className="text-button" onClick={() => setNewChatModalOpen(false)}> Отмена </Button>
        <Button className="text-button" onClick={() => setStep(1)}> Далее </Button>
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

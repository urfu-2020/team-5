import React, {useState} from "react";
import PropTypes from 'prop-types';

import './FirstStep/first-step-create-new-chat-modal.css';
import {FirstStepCreateNewChatModal} from "./FirstStep/FirstStepCreateNewChatModal";
import {SecondStepCreateNewChatModal} from "./SecondStep/SecondStepCreateNewChatModal";
import FocusLock from "react-focus-lock";

export const CreateNewChatModal = ({setNewChatModalOpen}) => {
  const [chatTitle, setChatTitle] = useState('');
  const [step, setStep] = useState(0);

  const handleOverlayClick = e => {
    if (e.target.classList.contains('modal-overlay'))
      setNewChatModalOpen(false);
  };

  const keyDownHandler = e => {
    if (e.key === 'Escape') {
      setNewChatModalOpen(false);
    }
  };


    return (
    <>
      <div
        tabIndex="-1"
        aria-hidden="true"
        className="modal-overlay"
        onClick={handleOverlayClick}
      />

      <FocusLock>
      {
        step === 0 ? (
          <FirstStepCreateNewChatModal
            onKeyDown={keyDownHandler}
            chatTitle={chatTitle}
            setChatTitle={setChatTitle}
            setNewChatModalOpen={setNewChatModalOpen}
            setStep={setStep}
          />
        ) : (
          <SecondStepCreateNewChatModal
            onKeyDown={keyDownHandler}
            setStep={setStep}
            setNewChatModalOpen={setNewChatModalOpen}
            chatTitle={chatTitle}
          />
        )
      }
      </FocusLock>
    </>
  );
}
;

CreateNewChatModal.propTypes = {
  setNewChatModalOpen: PropTypes.func
};

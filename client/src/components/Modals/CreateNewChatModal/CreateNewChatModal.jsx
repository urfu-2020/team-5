import React, {useState} from "react";
import PropTypes from 'prop-types';

import './FirstStep/first-step-create-new-chat-modal.css';
import {FirstStepCreateNewChatModal} from "./FirstStep/FirstStepCreateNewChatModal";
import {SecondStepCreateNewChatModal} from "./SecondStep/SecondStepCreateNewChatModal";

export const CreateNewChatModal = ({setNewChatModalOpen}) => {
  const [chatTitle, setChatTitle] = useState('');
  const [step, setStep] = useState(0);

  const handleOverlayClick = e => {
    if (e.target.classList.contains('modal-overlay'))
      setNewChatModalOpen(false);
  };

  return (
    <>
      <div
        tabIndex="-1"
        aria-hidden="true"
        className="modal-overlay"
        onClick={handleOverlayClick}
      />

      {
        step === 0 ? (
          <FirstStepCreateNewChatModal
            chatTitle={chatTitle}
            setChatTitle={setChatTitle}
            setNewChatModalOpen={setNewChatModalOpen}
            setStep={setStep}
          />
        ) : (
          <SecondStepCreateNewChatModal
            setStep={setStep}
            setNewChatModalOpen={setNewChatModalOpen}
            chatTitle={chatTitle}
          />
        )
      }
    </>
  );
}
;

CreateNewChatModal.propTypes = {
  setNewChatModalOpen: PropTypes.func
};

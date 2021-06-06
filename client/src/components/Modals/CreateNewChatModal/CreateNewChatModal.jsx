import React, {useState} from "react";
import PropTypes from 'prop-types';

import './NewChatInfo/new-chat-info-modal.css';
import {NewChatInfoModal} from "./NewChatInfo/NewChatInfoModal";
import {NewChatUsersModal} from "./NewChatUsers/NewChatUsersModal";

export const CreateNewChatModal = ({setNewChatModalOpen}) => {
    const [chatTitle, setChatTitle] = useState('');
    const [step, setStep] = useState(0);

    return step === 0 ? (
      <NewChatInfoModal
        chatTitle={chatTitle}
        setChatTitle={setChatTitle}
        setNewChatModalOpen={setNewChatModalOpen}
        setStep={setStep}
      />
    ) : (
      <NewChatUsersModal
        setStep={setStep}
        setNewChatModalOpen={setNewChatModalOpen}
        chatTitle={chatTitle}
      />
    );
  }
;

CreateNewChatModal.propTypes = {
  setNewChatModalOpen: PropTypes.func
};

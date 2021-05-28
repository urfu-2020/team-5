import React from "react";
import PropTypes from 'prop-types';
import {NewChatIcon} from "../../../UtilComponents/Icons/NewChatIcon";
import {Button} from "../../../UtilComponents/Button/Button";

import './new-chat-info-modal.css';
import {CloseIcon} from "../../../UtilComponents/Icons/CloseIcon";
import {Modal} from "../../ModalBase/Modal";
import {ErrorOnEmptyInput} from "../../../UtilComponents/Inputs/ErrorOnEmptyInput/ErrorOnEmptyInput";


export const NewChatInfoModal = ({
                                   chatTitle,
                                   setChatTitle,
                                   setNewChatModalOpen,
                                   setStep
                                 }) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <Modal
      onOverlayClick={() => setNewChatModalOpen(false)}
      className="new-chat-info-modal"
      role="dialog"
      aria-label="Модальное окно создания чата, 1 этап."
      aria-labelledby="input-chat-title"
    >
      <div className="new-chat-info-modal__chat-info">
        <Button
          onClick={() => setNewChatModalOpen(false)}
          className="rounded-button centred-button create-chat-modal__close-icon"
          Icon={<CloseIcon className="svg-button"/>}
        />
        <NewChatIcon className="new-chat-info-modal__chat-avatar default-chat-avatar"/>
        <div className="new-chat-info-modal__chat-title-input-wrapper">
          <label className="input-chat-title-label" htmlFor="input-chat-title">Введите название чата:</label>
          <ErrorOnEmptyInput
            value={chatTitle}
            onChange={setChatTitle}
            type="text"
            id="input-chat-title"
            errorMessage="Название чата не может быть пустым"
          />
        </div>
      </div>
      <div className="new-chat-info-modal__buttons">
        <Button className="text-button" onClick={() => setNewChatModalOpen(false)}> Отмена </Button>
        <Button
          disabled={chatTitle === ''}
          className="text-button"
          onClick={() => setStep(1)}
        > Далее </Button>
      </div>
    </Modal>
  );
};

NewChatInfoModal.propTypes = {
  chatTitle: PropTypes.string,
  setChatTitle: PropTypes.func,
  setNewChatModalOpen: PropTypes.func,
  setStep: PropTypes.func
};

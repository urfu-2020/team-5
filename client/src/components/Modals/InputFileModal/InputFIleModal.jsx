import React from 'react';
import PropTypes from 'prop-types';

import './input-file-modal.css';

import {ModalAttachment} from './ModalAttachment/ModalAttachment';
import {Button} from "../../UtilComponents/Button/Button";
import {Modal} from "../ModalBase/Modal";
import {CloseIcon} from "../../UtilComponents/Icons/CloseIcon";

const files = [
  {id: 123, title: 'file1.txt'},
  {id: 13, title: 'file2.txt'},
  {id: 32, title: 'file3.txt'}
];


export const InputFileModal = ({inputMessage, setInputMessage, setModalOpen}) => {
  return (
    <Modal
      className="input-file-modal"
      aria-label="окно загрузки файлов"
      onOverlayClick={() => setModalOpen(false)}
    >
      <section
        className="input-file-modal__attachments attachments"
        aria-label="прикрепленные файлы"
      >
        {files.map(({id, title}) => <ModalAttachment key={id} title={title}/>)}
      </section>
      <input
        value={inputMessage}
        onChange={e => setInputMessage(e.target.value)}
        type="text"
        className="input-file-modal__input-text input-message"
        autoComplete="off"
        placeholder="Введите сообщение..."
      />
      <section className="input-file-modal__buttons">
        <Button
          className="input-file-modal__button text-button"
          aria-label="Добавить файл"
        >
          Добавить
        </Button>
        <div className="input-file-modal__last-two-buttons">
          <Button
            className="input-file-modal__button cancel-button text-button"
            aria-label="Отмена прикрепления файлов"
            onClick={() => setModalOpen(false)}
          >
            Отменить
          </Button>
          <Button
            className="input-file-modal__button text-button"
            aria-label="Отправить сообщение"
          >
            Отправить
          </Button>
        </div>
      </section>
      <Button
        onClick={() => setModalOpen(false)}
        className="rounded-button centred-button input-file-modal__close-button"
        aria-label="закрыть окно"
        Icon={<CloseIcon className="svg-button"/>}
      />
    </Modal>
  );
};


InputFileModal.propTypes = {
  inputMessage: PropTypes.string,
  setInputMessage: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired
};

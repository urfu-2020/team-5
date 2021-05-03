import React from 'react';

import './input-file-modal.css';

import { ModalAttachment } from './ModalAttachment/ModalAttachment';
import { Button } from '@components/Controls/Button/Button';
import { closeModal, setInputMessage } from '@slices/currentChatSlice';
import { useDispatch, useSelector } from 'react-redux';

// так, тут файлы еще не загружены на сервер
// const files = [
//   { id: 123, originalTitle: 'file1.txt', type: 'Document', url: '/docs/1234.txt' },
//   { id: 13, originalTitle: 'file2.txt', type: 'Document', url: '/docs/3123.txt' },
//   { id: 32, originalTitle: 'file3.txt', type: 'Document', url: '/docs/23423.txt' }
// ];

const files = [
  { id: 123, title: 'file1.txt' },
  { id: 13, title: 'file2.txt' },
  { id: 32, title: 'file3.txt' }
];


export const InputFileModal = () => {
  const dispatch = useDispatch();
  const inputMessage = useSelector(state => state.currentChat.message);

  const handleEscape = e => {
    if(e.key === 'Escape')
      dispatch(closeModal());
  };

  const handleOverlayClick = e => {
    if(e.target.classList.contains('modal-overlay'))
      dispatch(closeModal());
  };

  return (
  <div
    className="modal-overlay"
    tabIndex="-1"
    onClick={handleOverlayClick}
    onKeyDown={handleEscape}
    aria-hidden="true"
  >
    <section className="input-file-modal" role="dialog" aria-label="окно загрузки файлов">
      <section
        className="input-file-modal__attachments attachments"
        aria-label="прикрепленные файлы"
      >
        {files.map(({ id, title }) => <ModalAttachment key={id} title={title} />)}
      </section>
      <input
        value={inputMessage}
        onChange={e => dispatch(setInputMessage(e.target.value))}
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
            onClick={() => dispatch(closeModal())}
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
        className="input-file-modal__close-button"
        aria-label="закрыть окно"
        onClick={() => dispatch(closeModal())}
      >
        <svg
          className="svg-button"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59
             12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </Button>
    </section>
  </div>
  );
};

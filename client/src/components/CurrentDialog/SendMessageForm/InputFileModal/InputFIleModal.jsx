import React from 'react';
import { ModalAttachment } from './ModalAttachment/ModalAttachment';

const files = [
  { id: 123, title: 'file1.txt' },
  { id: 13, title: 'file2.txt' },
  { id: 32, title: 'file3.txt' }
];

export const InputFileModal = () => (
  <div className="modal-overlay hidden" aria-hidden="true" tabIndex="-1">
    <section className="input-file-modal" role="dialog" aria-label="окно загрузки файлов">
      <section
        className="input-file-modal__attachments attachments"
        aria-label="прикрепленные файлы"
      >
        {files.map(({ id, title }) => <ModalAttachment key={id} title={title} />)}
      </section>
      <input
        type="text"
        className="input-file-modal__input-text input-message"
        autoComplete="off"
        placeholder="Введите сообщение..."
      />
      <section className="input-file-modal__buttons">
        <button
          className="input-file-modal__button button text-button"
          aria-label="Добавить файл"
          type="button"
        >
          Добавить
        </button>
        <div className="input-file-modal__last-two-buttons">
          <button
            type="button"
            className="input-file-modal__button cancel-button button text-button"
            aria-label="Отмена прикрепления файлов"
          >
            Отменить
          </button>
          <button
            type="button"
            className="input-file-modal__button button text-button"
            aria-label="Отправить сообщение"
          >
            Отправить
          </button>
        </div>
      </section>

      <button
        type="button"
        className="input-file-modal__close-button button"
        aria-label="закрыть окно"
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
      </button>
    </section>
  </div>
);
import React from 'react';
import PropTypes from 'prop-types';

import './send-message-form.css';

import {Button} from '@components/Controls/Button/Button';

export const SendMessageForm = ({ setOpenModal }) => (
  <form className="send-message-form" aria-label="отправить сообщение">
    <label
      htmlFor="input-file"
      className="button"
      aria-label="прикрепить файлы"
      role="button"
      tabIndex="0"
    >
      <input type="file" id="input-file" hidden multiple onChange={() => setOpenModal(true)} />
      <svg
        className="svg-button send-message-form__attach-files-button"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#000000"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5
          1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12
          2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5
          5.5s5.5-2.46 5.5-5.5V6h-1.5z"
        />
      </svg>
    </label>
    <input
      type="text"
      className="send-message-form__input-text input-message"
      autoComplete="off"
      placeholder="Введите сообщение..."
    />
    <Button className="button" aria-label="отправить сообщение" type="button">
      <svg
        className="svg-button send-message-form__send-button"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#000000"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </Button>
  </form>
);


SendMessageForm.propTypes = {
  setOpenModal: PropTypes.func.isRequired
};

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {useParams} from "react-router";
import { v4 as uuidv4 } from 'uuid';

import './send-message-form.css';

import {sendMessage} from "../../../store/middlewares/socketMiddleware";
import {Button} from "../../Controls/Button/Button";


export const SendMessageForm = ({isModalOpen, setModalOpen, inputMessage, setInputMessage}) => {
  const {chatId} = useParams();
  const userId = useSelector(state => state.user.id);
  const dispatch = useDispatch();

  const sendMessageHandler = e => {
    e.preventDefault();
    if(inputMessage === '') return;
    dispatch(
      sendMessage({
        messageId: uuidv4(),
        chatId: +chatId,
        senderId: userId,
        text: inputMessage,
        hasAttachments: false,
        status: 'Unread',
        time: new Date().toISOString()
      })
    );
    setInputMessage('');
  };

  return (
    <form className="send-message-form" aria-label="отправить сообщение" onSubmit={sendMessageHandler}>
      <label
        htmlFor="input-file"
        className="button"
        aria-label="прикрепить файлы"
        role="button"
        tabIndex="0"
      >
        <input type="file" id="input-file" hidden multiple onChange={() => setModalOpen(true)} />
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
        value={isModalOpen ? '' : inputMessage}
        onChange={e => setInputMessage(e.target.value)}
        type="text"
        className="send-message-form__input-text input-message"
        autoComplete="off"
        placeholder="Введите сообщение..."
      />
      <Button type="submit" aria-label="отправить сообщение">
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
};


SendMessageForm.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  inputMessage: PropTypes.string.isRequired,
  setInputMessage: PropTypes.func.isRequired
};

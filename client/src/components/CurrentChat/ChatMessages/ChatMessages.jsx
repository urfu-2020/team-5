import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import PropTypes from 'prop-types';

import './chat-messages.css';

import { ChatMessage } from './ChatMessage/ChatMessage';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import {debounce} from "../../../utils/debounce";
import {getDayInLocaleString, getTimeInLocaleString} from "../../../utils/time";
import {Spinner} from "../../Controls/Spinner/Spinner";

// FIXME При подгрузке сообщений оставаться на том же месте, а не прыгать в конец или начало
//
// TODO `Чат прокручивается до последнего сообщения если:
//          1) Мы отправляем сообщение
//          2) Мы находимся внизу чата и любой участник отправляет сообщение
//       Чат остается на том же месте при ререндере если:
//          1) Подгружаем старые сообщения
//          2) Скроллим чат (находимся не внизу чата), а другой участник отправляет сообщение
//             (Можно будет допилить и показывать кружок с количеством непрочитанных сообщений)`

const ChatMessages = ({chatId, lastMessageId}) => {
  const myId = useSelector(state => state.app.currentUser.id);

  const [chatOffset, setChatOffset] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isStartLoading, setStartLoading] = useState(true);
  const [isAddMessagesLoading, setAddMessagesLoading] = useState(false);

  const chatMessagesRef = useRef(null);
  const lastMessageRef = useRef(null);
  const prevLastMessageRef = useRef(null);

  useEffect(() => {
    if(lastMessageRef.current && prevLastMessageRef.current !== lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
      prevLastMessageRef.current = lastMessageRef.current;
    }
  }, [lastMessageRef.current, chatId]);

  useEffect(() => {
    (async () => {
      setStartLoading(true);
      const {oldMessages} = await (await fetch(`/api/chat/${chatId}/0`)).json();
      setMessages(oldMessages);
      setChatOffset(oldMessages.length);
      setStartLoading(false);
    })();
  }, [chatId]);

  const isNewDay = index => {
    if(index === 0) return true;
    const prevMessageTime = new Date(messages[index - 1].time);
    const newMessageTime = new Date(messages[index].time);
    return  newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
            newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
            newMessageTime.getDate() !== prevMessageTime.getDate();
  };

  const isMyMessage = senderId => senderId === myId;

  const addMessagesOnScroll = async e => {
    if(e.target.scrollTop === 0) {
      setAddMessagesLoading(true);
      const {oldMessages} = await (await fetch(`/api/chat/${chatId}/${chatOffset}`)).json();
      setMessages(currentMessages => [...oldMessages, ...currentMessages]);
      setChatOffset(currentOffset => currentOffset + oldMessages.length);
      setAddMessagesLoading(false);
    }
  };

  return isStartLoading ? <Spinner className="spinner_chat-main" /> :
    (
    <div className="chat-area chat-container__chat-area"
         ref={chatMessagesRef}
         onScroll={debounce(addMessagesOnScroll, 300)}
    >
      {
        isAddMessagesLoading ? <Spinner className="spinner_chat-load-messages" /> : null
      }
      {
        messages.length >  0 ? (
          messages.map(({id, text, senderId, time, status}, index) => {
            return (
              <React.Fragment key={id}>
                {
                  isNewDay(index) ? (
                    <h4 className="chat-date chat-area__chat-date">
                      {getDayInLocaleString(time)}
                    </h4>
                  ) : null
                }
                <ChatMessage
                  lastMessageRef={id === lastMessageId ? lastMessageRef : null}
                  text={text}
                  time={getTimeInLocaleString(time)}
                  isMyMessage={isMyMessage(senderId)}
                  status={status}
                  attachments={[]}
                />
              </React.Fragment>
            );
          })
        ) : <p> Сообщений пока нет. </p>
      }
    </div>
  );
};

export const MemoizedChatMessages = React.memo(ChatMessages);

ChatMessages.propTypes = {
  chatId: PropTypes.number.isRequired,
  lastMessageId: PropTypes.number
};


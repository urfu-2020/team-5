import React, {useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import PropTypes from 'prop-types';

import './chat-messages.css';

import { ChatMessage } from './ChatMessage/ChatMessage';
import { ChatHeader } from '../ChatHeader/ChatHeader';


const ChatMessages = ({chatId}) => {
  const myId = useSelector(state => state.app.currentUser.id);
  const currentChatInfo = (useSelector(state => state.app.chats))[chatId];
  const messages = currentChatInfo.messages;
  const isMyMessage = senderId => senderId === myId;
  const lastMessageRef = useRef(null);

  // TODO
  // Делать скролл к ласт мессаге если окно прокручено до конца или если currentUser ввел сообщение.
  // Если currentUser листает этот чат, а собеседник пишет,
  // то выводить кругляшок с количеством непрочитанных сообщений справа снизу
  useEffect(() => {
    if(lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
    }
  });

  const isNewDay = index => {
    if(index === 0) return true;
    const prevMessageTime = new Date(messages[index - 1].time);
    const newMessageTime = new Date(messages[index].time);
    return  newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
            newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
            newMessageTime.getDate() !== prevMessageTime.getDate();
  };

  return (
    <>
      <ChatHeader title={currentChatInfo.chatTitle} isOnline={true} />
      <div className="chat-area chat-container__chat-area">
        {
          messages.length >  0 ? (
            messages.map(({id, text, senderId, time, status}, index) => {
              return (
                <React.Fragment key={id}>
                  {
                    isNewDay(index) ? (
                      <h4 className="chat-date chat-area__chat-date">
                        {new Date(time).toLocaleDateString("ru-RU", { day: "numeric", month: "long"})}
                      </h4>
                    ) : null
                  }
                  <ChatMessage
                    lastMessageRef={index === messages.length - 1 ? lastMessageRef : null}
                    text={text}
                    time={new Date(time).toLocaleTimeString("ru-RU", {hour: "numeric", minute: "numeric"})}
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
    </>
  );
};

export const MemoizedChatMessages = React.memo(ChatMessages);

ChatMessages.propTypes = {
  chatId: PropTypes.number.isRequired
};


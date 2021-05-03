import React from 'react';

import './current-chat.css';

import { ChatMessage } from './ChatMessage/ChatMessage';
import { ChatHeader } from './ChatHeader/ChatHeader';
import {useSelector} from "react-redux";

export const CurrentChat = () => {
  const currentChatId = useSelector(state => state.currentChat.id);
  const myId = useSelector(state => state.app.currentUser.Id);
  // заменить везде chatsInfo на объект ид => чат
  const currentChatInfo = (useSelector(state => state.app.chatsInfo)).filter(chat => chat.ChatId === currentChatId);
  const messages = (useSelector(state => state.app.chatsMessages))[currentChatId];

  const isMyMessage = senderId => senderId === myId;

  const isNewDay = index => {
    if(index === 0) return true;
    const prevMessageTime = new Date(messages[index - 1].Time);
    const newMessageTime = new Date(messages[index].Time);
    return  newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
            newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
            newMessageTime.getDate() !== prevMessageTime.getDate();
  };

  return (
    <>
      <ChatHeader title={currentChatInfo.ChatTitle} isOnline={true} />
      <div className="chat-area chat-container__chat-area">
        {
          messages ? (
            messages.map(({Id, Text, SenderId, Time, Status}, index) => (
              <React.Fragment key={Id}>
                {
                  isNewDay(index) ? (
                    <h4 className="chat-date chat-area__chat-date">
                      {new Date(Time).toLocaleDateString("ru-RU", { day: "numeric", month: "long"})}
                    </h4>
                  ) : null
                }
                <ChatMessage
                  text={Text}
                  time={new Date(Time).toLocaleTimeString("ru-RU", { hour: "numeric", minute: "numeric" })}
                  isMyMessage={isMyMessage(SenderId)}
                  status={Status}
                  attachments={[]}
                />
              </React.Fragment>
            ))
          ) : <p> Сообщений пока нет. </p>
        }
      </div>
    </>
  );
};


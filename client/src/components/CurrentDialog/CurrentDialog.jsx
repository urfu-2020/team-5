import React from 'react';
import { ChatMessage } from './ChatMessage/ChatMessage';
import { DialogHeader } from './DialogHeader/DialogHeader';

const messages = [
  {
    id: 1, message: 'Привет!', time: '12:37', isMyMessage: true, isMessageRead: true
  },
  {
    id: 2, message: 'Привет!', time: '12:38', isMyMessage: false, isMessageRead: true
  },
  {
    id: 3, message: 'Когда начнём работать над проектом?', time: '12:40', isMyMessage: true, isMessageRead: true
  },
  {
    id: 4, message: 'Завтра точно начнём)', time: '12:41', isMyMessage: false, isMessageRead: true
  },
  {
    id: 5, message: 'Тогда напишу завтра', time: '12:41', isMyMessage: true, isMessageRead: true
  },

  {
    id: 6, message: 'Привет! Ну что, будем начинать?', time: '14:12', isMyMessage: true, isMessageRead: true
  },
  {
    id: 7,
    message: 'Привет, а давай ещё недельку отдохнём... Я что-то очень устал',
    time: '14:15',
    isMyMessage: false,
    isMessageRead: true
  },
  {
    id: 8, message: 'Ладно', time: '14:21', isMyMessage: true, isMessageRead: false
  }
];

export const CurrentDialog = () => (
  <>
    <DialogHeader name="Александр" status="В сети" />
    <div className="chat-area chat-container__chat-area">
      <h4 className="chat-date chat-area__chat-date">6 апреля</h4>
      {
        messages.slice(0, 5).map(({
          id, message, time, isMyMessage, isMessageRead
        }) => (
          <ChatMessage
            key={id}
            message={message}
            time={time}
            isMyMessage={isMyMessage}
            isMessageRead={isMessageRead}
          />
        ))
      }
      <h4 className="chat-date chat-area__chat-date">7 апреля</h4>
      {
        messages.slice(5).map(({
          id, message, time, isMyMessage, isMessageRead
        }) => (
          <ChatMessage
            key={id}
            message={message}
            time={time}
            isMyMessage={isMyMessage}
            isMessageRead={isMessageRead}
          />
        ))
      }
    </div>
  </>
);

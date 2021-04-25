import React from 'react';

import './current-dialog.css';

import { ChatMessage } from './ChatMessage/ChatMessage';
import { DialogHeader } from './DialogHeader/DialogHeader';

const messages = [
  {
    id: 1, text: 'Привет!', sender: 1, time: new Date('2021-04-06T12:37'), status: "Read", attachments: []
  },
  {
    id: 2, text: 'Привет!', sender: 2, time: new Date('2021-04-06T12:38'), status: "Read", attachments: []
  },
  {
    id: 3, text: 'Когда начнём работать над проектом?', sender: 1,
    time: new Date('2021-04-06T12:40'), status: "Read", attachments: []
  },
  {
    id: 4, text: 'Завтра точно начнём)', sender: 2, time: new Date('2021-04-06T12:41'), status: "Read", attachments: []
  },
  {
    id: 5, text: 'Тогда напишу завтра', sender: 1, time: new Date('2021-04-06T12:41'), status: "Read", attachments: []
  },

  {
    id: 6, text: 'Привет! Ну что, будем начинать?', sender: 1,
    time: new Date('2021-04-07T14:12'), status: "Read", attachments: []
  },
  {
    id: 7, text: 'Привет, а давай ещё недельку отдохнём... Я что-то очень устал', sender: 2,
    time: new Date('2021-04-07T14:15'), status: "Read", attachments: []
  },
  {
    id: 8, text: 'Ладно', sender: 1, time: new Date('2021-04-07T14:21'), status: "Unread", attachments: []
  }
];

const dialogInfo = {
  id: 12,
  name: "Александр",
  isOnline: true,
  countUnreadMessage: 0
};

export const CurrentDialog = () => {
  const { name, isOnline } = dialogInfo;

  // Пока что пусть мой айди 1, потом будем доставать из стора после логина
  const myId = 1;

  const isMyMessage = sender => sender === myId;

  const isNewDay = index => {
    if(index === 0) return true;
    const prevMessageTime = messages[index - 1].time;
    const newMessageTime = messages[index].time;
    return  newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
            newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
            newMessageTime.getDate() !== prevMessageTime.getDate();
  };

  return (
    <>
      <DialogHeader name={name} isOnline={isOnline} />
      <div className="chat-area chat-container__chat-area">
        {
          messages.map(({id, text, sender, time, status, attachments}, index) => (
              <>
                {
                  isNewDay(index) ? (
                    <h4 className="chat-date chat-area__chat-date">
                      {time.toLocaleDateString("ru-RU", { day: "numeric", month: "long"})}
                    </h4>
                  ) : null
                }
                <ChatMessage
                  key={id}
                  text={text}
                  time={time.toLocaleTimeString("ru-RU", { hour: "numeric", minute: "numeric" })}
                  isMyMessage={isMyMessage(sender)}
                  status={status}
                  attachments={attachments}
                />
              </>
          ))
        }
      </div>
    </>
  );
};


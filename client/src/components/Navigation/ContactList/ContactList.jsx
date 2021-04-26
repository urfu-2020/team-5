import React, { Component, useState } from 'react';

import { ContactCard } from '../ContactCard/ContactCard';

const cards = [
  {
    id: 2,
    name: "Иванов Иван",
    isOnline: true,
    message: {
      text: "Привет Ванька",
      sender: 1,
      time: "12:50",
      status: "Read",
      attachments: null
    },
    countUnreadMessage: 0
  },
  {
    id: 3,
    name: "Василий Гальперов",
    isOnline: true,
    message: {
      text: "Смотрел новый обзор?",
      sender: 1,
      time: "12:40",
      status: "UnreadRead",
      attachments: null
    },
    countUnreadMessage: 0
  },
  {
    id: 4,
    name: "Дмитрий Бурдуков",
    isOnline: true,
    message: {
      text: "Давай уже обсудим когда будем делать новое видео",
      sender: 4,
      time: "14:25",
      status: "Unread",
      attachments: null
    },
    countUnreadMessage: 15
  },
  {
    id: 5,
    name: "Александр Вилисов",
    isOnline: false,
    message: {
      text: `Вы: Яндекс - это российская транснациональная компания в отрасли информационных технологий, 
            чьё головное юридическое лицо зарегистрировано в Нидерландах, владеющая одноимённой системой 
            поиска в интернете, интернет-порталом и веб-службами в нескольких странах.`,
      sender: 1,
      time: "14:30",
      status: "Unread",
      attachments: null
    },
    countUnreadMessage: 15
  }
];

export const ContactList = () => (
  <>
    <ul>
      <li>
        {
          cards.map(({
            id, name, isOnline, message, countUnreadMessage
          }) => (
            <ContactCard
              key={id}
              id={id}
              name={name}
              isOnline={isOnline}
              message={message}
              countUnreadMessage={countUnreadMessage}
            />
          ))
        }
      </li>
    </ul>
  </>
);
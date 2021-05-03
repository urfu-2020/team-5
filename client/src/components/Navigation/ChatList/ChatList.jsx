import React, {Component, useEffect, useState} from 'react';

import { ChatCard } from '../ChatCard/ChatCard';
import PropTypes from "prop-types";
import {HomePage} from "../../HomePage";
import {useSelector} from "react-redux";

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



export const ChatList = () => {
  const chatsInfo = useSelector(state => state.app.chatsInfo);

  return (
    <>
      <ul>
        <li>
          {
            chatsInfo.map(({
                             ChatId, ChatType, ChatAvatarUrl, ChatTitle
                       }) => (
              <ChatCard
                key={ChatId}
                id={ChatId}
                title={ChatTitle}
                avatarUrl={ChatAvatarUrl}

                isOnline={true}
                message={{ text: 'TODO'}}
                countUnreadMessage={1}
              />
            ))
          }
        </li>
      </ul>
    </>
  );
};

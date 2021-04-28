import React, {Component, useEffect, useState} from 'react';

import { ContactCard } from '../ContactCard/ContactCard';
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



export const ContactList = () => {
  const contacts = useSelector(state => state.app.contacts);

  console.log(contacts);

  const mixContactsWithFakeData = contacts.map(contact => {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    return {...randomCard, ...contact};
  });

  return (
    <>
      <ul>
        <li>
          {
            mixContactsWithFakeData.map(({
                         Id, Username, AvatarUrl, isOnline, message, countUnreadMessage
                       }) => (
              <ContactCard
                key={Id}
                id={Id}
                name={Username}
                isOnline={isOnline}
                message={message}
                countUnreadMessage={countUnreadMessage}
                avatarUrl={AvatarUrl}
              />
            ))
          }
        </li>
      </ul>
    </>
  );
};

ContactList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    Id: PropTypes.number,
    Username: PropTypes.string,
    AvatarUrl: PropTypes.string,
    GithubUrl: PropTypes.string
  }))
};

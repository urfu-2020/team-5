import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useHistory} from "react-router-dom";

import './chat-card.css';

export const ChatCard = ({ id, currentChatId, title, isOnline, message, countUnreadMessage, avatarUrl }) => {
  const history = useHistory();

  const openChatOnHandler = () => {
    history.push(`/chat/${id}`);
  };

  const openChatOnEnter = (e) => {
    if(e.key === 'Enter')
      openChatOnHandler();
  };

  return (
    <div className={`card ${currentChatId === id ? 'card_current' : ''}`}
         role={"button"} tabIndex={0} onClick={openChatOnHandler} onKeyDown={openChatOnEnter}>
      <div className="card__avatar">
        <svg role="none" style={{height: '64px', width: '64px'}}>
          <defs>
            <mask id="circle_online">
              <circle cx="32" cy="32" fill="white" r="32"/>
              <circle cx="56" cy="56" fill="black" r="7"/>
            </mask>
            <mask id="circle_offline">
              <circle cx="32" cy="32" fill="white" r="32"/>
            </mask>
          </defs>
          <g mask={`${isOnline ? 'url(#circle_online)' : 'url(#circle_offline)'}`}>
            <image x="0" y="0" height="100%" preserveAspectRatio="xMidYMid slice" width="100%"
                  xlinkHref={avatarUrl} style={{height: '64px', width: '64px'}} />
            <circle className="avatar__border" cx="32" cy="32" r="32"/>
          </g>
        </svg>
        {
          isOnline ? (<div className="badge"/>) : null
        }
      </div>
      <div className="card__content">
        <h3 className="dialogHeader">{title}</h3>
        {
          message.sender !== id ? (
            <>
              <p className="messagePreview"><span className="messageSender">Вы:</span> {message.text}</p>
              <p className="messageTime">{message.time}</p>
              {
                message.status === "Read" ? (
                  <svg
                    className="messageStatus"
                    height="20px"
                    viewBox="0 0 24 24"
                    width="20px"
                    fill="#000000">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path
                      d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17
                    7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                  </svg>
                ) : (
                  <svg className="messageStatus" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                  </svg>
                )
              }
            </>

          ) : (
            <>
              <p className="messageTime">{message.time}</p>
              <p className="messagePreview">{message.text}</p>
              <p className="unreadMessageCounter">{countUnreadMessage}</p>
            </>
          )
        }
      </div>
    </div>
    );
};

ChatCard.propTypes = {
  id: PropTypes.number.isRequired,
  currentChatId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isOnline: PropTypes.bool.isRequired,
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["Read", "Unread", "UnSend"]).isRequired,
    attachments: PropTypes.Attachments
  }),
  countUnreadMessage: PropTypes.number,
  avatarUrl: PropTypes.string
};

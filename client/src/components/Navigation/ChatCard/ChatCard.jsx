import React from 'react';
import PropTypes from 'prop-types';
import {useHistory} from "react-router-dom";

import './chat-card.css';
import {useSelector} from "react-redux";
import {getTimeInLocaleString} from "../../../utils/time";
import {ChatAvatar} from "./ChatAvatar/ChatAvatar";
import {MessageReadIcon} from "../../Controls/Icons/MessageReadIcon";
import {MessageUnreadIcon} from "../../Controls/Icons/MessageUnreadIcon";
import {SavedMessagesIcon} from "../../Controls/Icons/SavedMessageIcon/SavedMessagesIcon";


export const ChatCard = ({ chatId, currentChatId, chatType,
                           title, isOnline, lastMessage, countUnreadMessage, avatarUrl }) => {
  const history = useHistory();
  const userId = useSelector(state => state.user.id);

  const openChatHandler = () => {
    history.push(`/chat/${chatId}`);
  };

  const openChatOnEnter = (e) => {
    if(e.key === 'Enter')
      openChatHandler();
  };

  return (
    <li className=
           {`card
            ${currentChatId === chatId ? 'card_current' : ''}
            ${chatType === 'Own' ? 'card_own' : ''}
          `}
         role={"button"}
         tabIndex={0}
         onClick={openChatHandler}
         onKeyDown={openChatOnEnter}
    >
      {
        chatType === 'Own' ? <SavedMessagesIcon /> : <ChatAvatar avatarUrl={avatarUrl} isOnline={isOnline}/>
      }
      <div className="card__content">
        <h3 className="dialogHeader">
          {
            chatType === 'Own' ? 'Saved Messages' : title
          }
        </h3>
        {
          lastMessage ?
          lastMessage.senderId === userId ? (
            <>
              <p className="messagePreview"><span className="messageSender">Вы: </span> {lastMessage.text}</p>
              <p className="messageTime">{getTimeInLocaleString(lastMessage.time)}</p>
              {
                lastMessage.status === "Read" ? <MessageReadIcon /> : (
                    <div className="card__avatar">
                      <MessageUnreadIcon />
                    </div>
                )
              }
            </>
          ) : (
            <>
              <p className="messageTime">{getTimeInLocaleString(lastMessage.time)}</p>
              <p className="messagePreview">{lastMessage.text}</p>
              <p className="unreadMessageCounter">{countUnreadMessage}</p>
            </>
          ) : null
        }
      </div>
    </li>
    );
};



ChatCard.propTypes = {
  chatId: PropTypes.number.isRequired,
  currentChatId: PropTypes.number,
  chatType: PropTypes.oneOf(['Own', 'Dialog', 'Group']),
  lastMessage: PropTypes.shape({
    id: PropTypes.string,
    chatId: PropTypes.number,
    senderId: PropTypes.number,
    text: PropTypes.string,
    hasAttachments: PropTypes.bool,
    status: PropTypes.oneOf(['Read', 'Unread', 'UnSend']),
    time: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  isOnline: PropTypes.bool.isRequired,
  countUnreadMessage: PropTypes.number,
  avatarUrl: PropTypes.string
};

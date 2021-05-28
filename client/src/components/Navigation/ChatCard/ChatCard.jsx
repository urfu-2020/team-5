import React from 'react';
import PropTypes from 'prop-types';
import {useHistory} from "react-router-dom";

import './chat-card.css';

import {useSelector} from "react-redux";
import {getTimeInLocaleString} from "../../../utils/time";
import {MessageReadIcon} from "../../UtilComponents/Icons/MessageReadIcon";
import {MessageUnreadIcon} from "../../UtilComponents/Icons/MessageUnreadIcon";
import {selectUserId} from "../../../store/slices/userSlice/userSelectors";
import {getRenderChatInfo} from "../../../utils/chatUtils";


export const ChatCard = ({
                           chatId, currentChatId, chatType, className,
                           title, isOnline, lastMessage, countUnreadMessage, avatarUrl
                         }) => {
  const history = useHistory();
  const userId = useSelector(selectUserId);

  const openChatHandler = () => {
    history.push(`/chat/${chatId}`);
  };

  const openChatOnEnter = (e) => {
    if (e.key === 'Enter')
      openChatHandler();
  };

  const renderChatInfo = getRenderChatInfo(chatType, {title, avatarUrl, isOnline});

  return (
    <li
      className={`card ${currentChatId === chatId ? 'card_current' : ''} ${className ? className : ''}`}
      role="button"
      tabIndex={0}
      onClick={openChatHandler}
      onKeyDown={openChatOnEnter}
      aria-label={renderChatInfo.ariaLabel}
    >
      {renderChatInfo.avatar}
      <div className="card__content">
        <h3
          className="dialogHeader"
          aria-label="Название чата"
        >
          {chatType === 'Own' ? 'Saved Messages' : title}
        </h3>
        {
          lastMessage ?
            lastMessage.senderId === userId ? (
              <>
                <p
                  className="messagePreview"
                  aria-label="Ваше сообщение"
                >
                  <span className="messageSender" aria-hidden="true">Вы: </span> {lastMessage.text}
                </p>
                <p
                  className="messageTime"
                  aria-label="Время последнего сообщения"
                >
                  {/*кстати тут не подумали про указание дней*/}
                  {getTimeInLocaleString(lastMessage.time)}
                </p>
                {
                  lastMessage.status === "Read" ? <MessageReadIcon /> : <MessageUnreadIcon />
                }
              </>
            ) : (
              <>
                <p
                  className="messageTime"
                  aria-label="Время последнего сообщения"
                >
                  {getTimeInLocaleString(lastMessage.time)}
                </p>
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
  className: PropTypes.string,
  chatId: PropTypes.number,
  currentChatId: PropTypes.number,
  chatType: PropTypes.oneOf(['Own', 'Dialog', 'Group', 'Channel']),
  lastMessage: PropTypes.shape({
    id: PropTypes.number,
    chatId: PropTypes.number,
    senderId: PropTypes.number,
    text: PropTypes.string,
    hasAttachments: PropTypes.bool,
    status: PropTypes.oneOf(['Read', 'Unread', 'UnSend']),
    time: PropTypes.string,
  }),
  title: PropTypes.string,
  isOnline: PropTypes.bool,
  countUnreadMessage: PropTypes.number,
  avatarUrl: PropTypes.string
};

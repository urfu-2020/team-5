import React from 'react';
import PropTypes from 'prop-types';
import {useHistory} from "react-router-dom";

import './chat-card.css';

import {useDispatch, useSelector} from "react-redux";
import {getTimeInLocaleString} from "../../../utils/time";
import {MessageReadIcon} from "../../UtilComponents/Icons/MessageReadIcon";
import {MessageUnreadIcon} from "../../UtilComponents/Icons/MessageUnreadIcon";
import {selectUserId} from "../../../store/slices/userSlice/userSelectors";
import {getDialogInfo, getRenderChatInfo} from "../../../utils/chatUtils";
import {searchingTypes} from "../ChatList/SearchResultList/SearchResultList";
import {setFoundMessage} from "../../../store/slices/appSlice/appSlice";


export const ChatCard = ({
                           searchingType,
                           className,
                           describedMessage,
                           chat,
                           currentChatId,
                           currentUserId }) => {
  let {id, chatType, chatAvatarUrl, chatTitle, members} = chat;

  const dispatch = useDispatch();

  if(chatType === 'Dialog' || chatType === 'Own') {
    const { dialogAvatarUrl, dialogChatTitle } = getDialogInfo(members, chatType, currentUserId);
    if (dialogAvatarUrl) chatAvatarUrl = dialogAvatarUrl;
    if (dialogChatTitle) chatTitle = dialogChatTitle;
  }

  const history = useHistory();
  const userId = useSelector(selectUserId);

  const openChatHandler = () => {
    if (searchingType) {
      if (searchingType === searchingTypes.Messages) {
        dispatch(setFoundMessage(describedMessage));
      } else if (searchingType === searchingTypes.Channels) {
        dispatch(setFoundMessage(null));
      }
    }
    history.push(`/chat/${id}`);
  };

  const openChatOnEnter = (e) => {
    if (e.key === 'Enter')
      openChatHandler();
  };

  const renderChatInfo = getRenderChatInfo(chatType,
    {title: chatTitle, avatarUrl: chatAvatarUrl, isOnline: false});

  return (
    <li
      className={`card ${currentChatId === id ? 'card_current' : ''} ${className ? className : ''}`}
      role="button"
      tabIndex={0}
      onClick={openChatHandler}
      onKeyDown={openChatOnEnter}
      aria-label={renderChatInfo.ariaLabel}
    >
      {renderChatInfo.avatar}
      <div className={`card__content ${searchingType && searchingType === searchingTypes.Channels ?
        'card__content_channels' : 'card__content_chat'} `}
      >
        <h3
          className="dialogHeader"
          aria-label="Название чата"
        >
          {chatType === 'Own' ? 'Saved Messages' : chatTitle}
        </h3>
        {
          chatType === "Channel" &&
          searchingType === searchingTypes.Channels ? (
            <p title={describedMessage} className="card__description">{describedMessage}</p>
            ) :
            describedMessage ?
              describedMessage.senderId === userId ? (
              <>
                <p
                  className="messagePreview"
                  aria-label="Ваше сообщение"
                >
                  <span className="messageSender" aria-hidden="true">Вы: </span> {describedMessage.text}
                </p>
                <p
                  className="messageTime"
                  aria-label="Время отображаемого сообщения"
                >
                  {/*кстати тут не подумали про указание дней*/}
                  {getTimeInLocaleString(describedMessage.time)}
                </p>
                {describedMessage.status === "Read" ? <MessageReadIcon /> : <MessageUnreadIcon />}
              </>
            ) : (
              <>
                <p
                  className="messageTime"
                  aria-label="Время отображаемого сообщения"
                >
                  {getTimeInLocaleString(describedMessage.time)}
                </p>
                <p className="messagePreview">{describedMessage.text}</p>
                {/*<p className="unreadMessageCounter">{countUnreadMessage}</p>*/}
              </>
            ) : null
        }
      </div>
    </li>
  );
};


ChatCard.propTypes = {
  searchingType: PropTypes.string,
  className: PropTypes.string,
  currentChatId: PropTypes.number,
  currentUserId: PropTypes.number,
  describedMessage: PropTypes.shape({
    id: PropTypes.number.isRequired,
    chatId: PropTypes.number.isRequired,
    senderId: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    hasAttachments: PropTypes.bool,
    status: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  }),
  chat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    chatType: PropTypes.oneOf(["Own", "Dialog", "Group", "Channel"]),
    description: PropTypes.string,
    owner: PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      avatarUrl: PropTypes.string,
      githubUrl: PropTypes.string
    }),
    chatAvatarUrl: PropTypes.string,
    chatTitle: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      avatarUrl: PropTypes.string,
      githubUrl: PropTypes.string
    })),
    lastMessage: PropTypes.shape({
      id: PropTypes.number.isRequired,
      chatId: PropTypes.number.isRequired,
      senderId: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      hasAttachments: PropTypes.bool,
      status: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired
    })
  })
};

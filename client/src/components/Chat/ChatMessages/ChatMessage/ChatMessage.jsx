import React from 'react';
import PropTypes from 'prop-types';
import {MessageReadIcon} from "../../../UtilComponents/Icons/MessageReadIcon";
import {MessageUnreadIcon} from "../../../UtilComponents/Icons/MessageUnreadIcon";
import {NewChannelIcon} from "../../../UtilComponents/Icons/NewChannelIcon";

export const ChatMessage = ({chatType, text, time, isMyMessage, avatarUrl, status}) => {
  return (
    <li
      className={`chat-area__message ${isMyMessage ? 'chat-area__message_my' : 'chat-area__message_income'}`}
      // aria-label={isMyMessage ? `Мое сообщение: ${text}` : `Сообщение собеседника: ${text}`}
    >
      <div
        className={`cloud message__cloud
        ${isMyMessage ? 'message__cloud_my cloud_my' : 'message__cloud_income cloud_income'}`}
      >
      <span className="message-text cloud__message-text">
        {text}
      </span>
        <span className="message-time cloud__message-time">
        {time}
      </span>
        {
          isMyMessage ? (
            <svg
              className="ticks cloud__ticks"
              height="20px"
              viewBox="0 0 24 24"
              width="20px"
              fill="#000000"
            >
              {
                status === "Read" ? <MessageReadIcon/> : <MessageUnreadIcon/>
              }
            </svg>
          ) : null
        }
      </div>
      {
        chatType === 'Channel' ?
          <NewChannelIcon className="message__chat-avatar icon-message-avatar" /> :
          <img className="message__chat-avatar" alt="user avatar" src={`${avatarUrl}`} />
      }

    </li>
  );
};

ChatMessage.propTypes = {
  chatType: PropTypes.oneOf(['Own', 'Group', 'Dialog', 'Channel']),
  text: PropTypes.string,
  time: PropTypes.string.isRequired,
  isMyMessage: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(['Read', 'Unread', 'UnSend']).isRequired,
  avatarUrl: PropTypes.string.isRequired,
  attachments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['Document', 'Movie', 'Music', 'Picture']).isRequired,
    url: PropTypes.string.isRequired
  }))
};

ChatMessage.defaultProps = {
  text: ''
};

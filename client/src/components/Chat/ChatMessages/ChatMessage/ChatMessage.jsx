import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {MessageReadIcon} from "../../../UtilComponents/Icons/MessageReadIcon";
import {MessageUnreadIcon} from "../../../UtilComponents/Icons/MessageUnreadIcon";
import {NewChannelIcon} from "../../../UtilComponents/Icons/NewChannelIcon";
import {useDispatch, useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../../../store/slices/appSlice/appSelectors";

export const ChatMessage = ({id, chatType, text, time,
                              isMyMessage, avatarUrl, status, foundMessage}) => {

  const messageRef = useRef();
  const isDarkTheme = useSelector(selectIsDarkTheme);

  useEffect(() => {
    if (foundMessage && id === foundMessage.id) {
      if (messageRef.current) {
        messageRef.current.scrollIntoView();
      }
    }
  }, [foundMessage]);


  return (
    <div className={`chat-area__message-container
      ${isDarkTheme ? 'message_dark' : ''}
      ${foundMessage && foundMessage.id === id && 'chat-area__found-message'}`}>
      <li
        ref={messageRef}
        className={`chat-area__message
        ${isMyMessage ? 'chat-area__message_my' : 'chat-area__message_income'}
      `}
      >
        <div
          className={`cloud message__cloud
          ${isMyMessage ? 'message__cloud_my cloud_my' : 'message__cloud_income cloud_income'}
        `}
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
    </div>
  );
};

ChatMessage.propTypes = {
  id: PropTypes.number,
  lastMessage: PropTypes.object,
  endMessagesRef: PropTypes.object,
  foundMessage: PropTypes.object,
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

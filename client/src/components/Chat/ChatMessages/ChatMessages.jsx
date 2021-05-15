import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import PropTypes from 'prop-types';

import './chat-messages.css';

import {ChatMessage} from './ChatMessage/ChatMessage';
import {throttle} from "../../../utils/throttle";
import {getDayInLocaleString, getTimeInLocaleString} from "../../../utils/time";
import {Spinner} from "../../Controls/Spinner/Spinner";
import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {config} from "../../../config";


const getSobesednikAvatarUrl = (sobesedniki, senderId) => {
  return sobesedniki.find(user => user.id === senderId).avatarUrl;
};

const isMyMessage = (myId, senderId) => {
  return myId === senderId;
};

const isNewDay = (messages, index) => {
  if (index === 0) return true;
  const prevMessageTime = new Date(messages[index - 1].time);
  const newMessageTime = new Date(messages[index].time);
  return newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
    newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
    newMessageTime.getDate() !== prevMessageTime.getDate();
};

const loadOldMessages = async ({chatId, offset, cbOnAllLoaded, controller}) => {
  const {LOAD_MESSAGES_THRESHOLD} = config;
  try {
    const {oldMessages} = await (await fetch(`/api/chat/${chatId}/${offset}/${LOAD_MESSAGES_THRESHOLD}`, {
      signal: controller.signal
    })).json();

    if (oldMessages.length < LOAD_MESSAGES_THRESHOLD) {
      cbOnAllLoaded();
    }
    return {oldMessages};
  } catch (e) {
    console.error(e);
  }
};


const ChatMessages = ({currentChatInfo}) => {
  const currentUser = useSelector(selectCurrentUser);

  const {chatId, sobesedniki, lastMessage} = currentChatInfo;

  const [messages, setMessages] = useState([]);
  const [isOldMessagesLoading, setOldMessagesLoading] = useState(false);
  const [isAllMessagesLoaded, setIsAllMessagesLoaded] = useState(false);
  const [prevChatId, setPrevChatId] = useState(null);

  const fetchControllerRef = useRef(null);
  const endMessagesRef = useRef(null);
  const prevLastMessageRef = useRef(null);

  useEffect(() => {
    fetchControllerRef.current = new AbortController();
    (async () => {
      const response = await loadOldMessages({
        chatId,
        offset: 0,
        cbOnAllLoaded: () => setIsAllMessagesLoaded(true),
        controller: fetchControllerRef.current
      });
      if(response) {
        setMessages(response.oldMessages);
        setPrevChatId(chatId);
      }
    })();

    return () => {
      fetchControllerRef.current.abort();
      prevLastMessageRef.current = null;
      setIsAllMessagesLoaded(false);
    };
  }, [chatId]);

  useEffect(() => {
    setMessages(prevMessages => [...prevMessages, lastMessage]);
  }, [lastMessage]);

  useEffect(() => {
      if (endMessagesRef.current &&
         (!prevLastMessageRef.current ||
           lastMessage !== prevLastMessageRef.current)) {
        endMessagesRef.current.scrollIntoView({ behavior: "smooth"});
        prevLastMessageRef.current = lastMessage;
      }
  }, [messages]);

  const addMessagesOnScroll = async e => {
    if (e.target.scrollTop === 0 && !isAllMessagesLoaded && !isOldMessagesLoading) {
      setOldMessagesLoading(true);
      const response = await loadOldMessages({
        chatId,
        offset: messages.length,
        cbOnAllLoaded: () => setIsAllMessagesLoaded(true),
        controller: fetchControllerRef.current
      });

      if(response) {
        setMessages(laterMessages => [...response.oldMessages, ...laterMessages]);
        setOldMessagesLoading(false);
      }
    }
  };


  return (
    <div className="chat-area chat-container__chat-area" onScroll={throttle(addMessagesOnScroll, 300)}>
      {
        // если чат сменился и еще не загрузился
        prevChatId !== chatId ? <Spinner className="spinner_chat-main"/> : (
          <>
            {
              isOldMessagesLoading ? <Spinner className="spinner_chat-load-messages"/> :
                isAllMessagesLoaded ? <p> Начало диалога. </p> : null
            }
            {
              messages.map(({id, text, senderId, time, status}, index) => {
                return (
                  <React.Fragment key={id}>
                    {
                      isNewDay(messages, index) ? (
                        <h4 className="chat-date chat-area__chat-date">
                          {getDayInLocaleString(time)}
                        </h4>
                      ) : null
                    }
                    <ChatMessage
                      text={text}
                      time={getTimeInLocaleString(time)}
                      isMyMessage={isMyMessage(currentUser.id, senderId)}
                      avatarUrl={isMyMessage(currentUser.id, senderId) ? currentUser.avatarUrl :
                        getSobesednikAvatarUrl(sobesedniki, senderId)}
                      status={status}
                      attachments={[]}
                    />
                  </React.Fragment>
                );
              })
            }
          </>
        )
      }
      <div ref={endMessagesRef}/>
    </div>
  );
};

export const MemoizedChatMessages = React.memo(ChatMessages);

ChatMessages.propTypes = {
  currentChatInfo: PropTypes.shape({
    chatId: PropTypes.number.isRequired,
    chatType: PropTypes.oneOf(["Own", "Dialog", "Group"]),
    chatAvatarUrl: PropTypes.string.isRequired,
    chatTitle: PropTypes.string.isRequired,
    sobesedniki: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      avatarUrl: PropTypes.string,
      githubUrl: PropTypes.string
    })),
    lastMessage: PropTypes.shape({
      id: PropTypes.string.isRequired,
      chatId: PropTypes.number.isRequired,
      senderId: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      hasAttachments: PropTypes.bool,
      status: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired
    })
  })
};


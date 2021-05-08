import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';

import './chat-messages.css';

import {ChatMessage} from './ChatMessage/ChatMessage';
import {throttle} from "../../../utils/throttle";
import {getDayInLocaleString, getTimeInLocaleString} from "../../../utils/time";
import {Spinner} from "../../Controls/Spinner/Spinner";
import {useParams} from "react-router";
import {loadOldMessages} from "../../../store/slices/appSlice";

// FIXME При подгрузке сообщений оставаться на том же месте, а не прыгать в конец или начало
//
// TODO `Чат прокручивается до последнего сообщения если:
//          1) Мы отправляем сообщение
//          2) Мы находимся внизу чата и любой участник отправляет сообщение
//       Чат остается на том же месте при ререндере если:
//          1) Подгружаем старые сообщения
//          2) Скроллим чат (находимся не внизу чата), а другой участник отправляет сообщение
//             (Можно будет допилить и показывать кружок с количеством непрочитанных сообщений)`

const getSobesednikAvatarUrl = (sobesedniki, senderId) => {
  return sobesedniki.find(user => user.id === senderId).avatarUrl;
};

const isMyMessage = (myId, senderId) => myId === senderId;

const isNewDay = (messages, index) => {
  if (index === 0) return true;
  const prevMessageTime = new Date(messages[index - 1].time);
  const newMessageTime = new Date(messages[index].time);
  return newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
    newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
    newMessageTime.getDate() !== prevMessageTime.getDate();
};

const ChatMessages = ({currentChatInfo}) => {
  const {messages, chatId, sobesedniki} = currentChatInfo;
  const lastMessage = messages[messages.length - 1];
  const currentUser = useSelector(state => state.app.currentUser);
  const myId = currentUser.id;
  const myAvatarUrl = currentUser.avatarUrl;

  const dispatch = useDispatch();

  const [isStartLoading, setStartLoading] = useState(true);
  const [isAddMessagesLoading, setAddMessagesLoading] = useState(false);
  const [isAllMessagesLoaded, setIsAllMessagesLoaded] = useState(false);

  // FIXME скролл сделан криво, переделать потом
  const chatMessagesRef = useRef(null);
  const lastMessageRef = useRef(null);
  const prevLastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current && prevLastMessageRef.current !== lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
      prevLastMessageRef.current = lastMessageRef.current;
    }
  });

  // первый раз открыли чат
  useEffect(() => {
    (async () => {
      if(messages.length === 1) {
        setStartLoading(true);
        const {oldMessages} = await (await fetch(`/api/chat/${chatId}/1`)).json();
        dispatch(loadOldMessages({chatId, messages: oldMessages}));
        setStartLoading(false);
      }
    })();
  }, [chatId]);

  const addMessagesOnScroll = async e => {
    if (e.target.scrollTop === 0 && !isAllMessagesLoaded && !isAddMessagesLoading) {
      setAddMessagesLoading(true);
      const {oldMessages} = await (await fetch(`/api/chat/${chatId}/${messages.length}`)).json();
      if (oldMessages.length === 0) {
        setIsAllMessagesLoaded(true);
      } else {
        dispatch(loadOldMessages({chatId, messages: oldMessages}));
      }
      setAddMessagesLoading(false);
    }
  };

  return isStartLoading ? <Spinner className="spinner_chat-main"/> :
    (
      <div className="chat-area chat-container__chat-area"
           ref={chatMessagesRef}
           onScroll={throttle(addMessagesOnScroll, 300)}
      >
        {
          isAddMessagesLoading ? <Spinner className="spinner_chat-load-messages"/> :
            isAllMessagesLoaded ? <p> Начало диалога. </p> : null
        }
        {
          messages.length > 0 ? (
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
                    lastMessageRef={lastMessage && id === lastMessage.id ? lastMessageRef : null}
                    text={text}
                    time={getTimeInLocaleString(time)}
                    isMyMessage={isMyMessage(myId, senderId)}
                    avatarUrl={isMyMessage(myId, senderId) ? myAvatarUrl :
                      getSobesednikAvatarUrl(sobesedniki, senderId)}
                    status={status}
                    attachments={[]}
                  />
                </React.Fragment>
              );
            })
          ) : <p> Сообщений пока нет. </p>
        }
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
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      chatId: PropTypes.number.isRequired,
      senderId: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      hasAttachments: PropTypes.bool,
      status: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired
    }))
  })
};


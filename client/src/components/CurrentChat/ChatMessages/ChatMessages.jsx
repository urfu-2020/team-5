import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import PropTypes from 'prop-types';

import './chat-messages.css';

import { ChatMessage } from './ChatMessage/ChatMessage';
import {debounce} from "../../../utils/debounce";
import {getDayInLocaleString, getTimeInLocaleString} from "../../../utils/time";
import {Spinner} from "../../Controls/Spinner/Spinner";
import {useParams} from "react-router";

// FIXME При подгрузке сообщений оставаться на том же месте, а не прыгать в конец или начало
//
// TODO `Чат прокручивается до последнего сообщения если:
//          1) Мы отправляем сообщение
//          2) Мы находимся внизу чата и любой участник отправляет сообщение
//       Чат остается на том же месте при ререндере если:
//          1) Подгружаем старые сообщения
//          2) Скроллим чат (находимся не внизу чата), а другой участник отправляет сообщение
//             (Можно будет допилить и показывать кружок с количеством непрочитанных сообщений)`

const ChatMessages = ({ currentChatInfo}) => {
  const {chatId} = useParams();
  const lastMessage = currentChatInfo.lastMessage;
  const currentUser = useSelector(state => state.app.currentUser);
  const myId = currentUser.id;
  const myAvatarUrl = currentUser.avatarUrl;
  // sobesednikAvatarUrl будет работать только для Dialog и Own,
  // потом подумать как организовать для групп аватарки и ники пишущих
  // (мб из бд отдавать Message с этими данными)
  const sobesednikAvatarUrl = currentChatInfo.sobesednikAvatarUrl;

  const [chatOffset, setChatOffset] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isStartLoading, setStartLoading] = useState(true);
  const [isAddMessagesLoading, setAddMessagesLoading] = useState(false);

  // FIXME скролл сделан криво, переделать потом
  const chatMessagesRef = useRef(null);
  const lastMessageRef = useRef(null);
  const prevLastMessageRef = useRef(null);

  useEffect(() => {
    if(lastMessageRef.current && prevLastMessageRef.current !== lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
      prevLastMessageRef.current = lastMessageRef.current;
    }
  });

  useEffect(() => {
    (async () => {
      setStartLoading(true);
      const {oldMessages} = await (await fetch(`/api/chat/${chatId}/0`)).json();
      setMessages(oldMessages);
      setChatOffset(oldMessages.length);
      setStartLoading(false);
    })();
  }, [chatId]);

  useEffect(() => {
    setMessages(prevMessages => [...prevMessages, lastMessage]);
  }, [lastMessage]);

  const isNewDay = index => {
    if(index === 0) return true;
    const prevMessageTime = new Date(messages[index - 1].time);
    const newMessageTime = new Date(messages[index].time);
    return  newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
            newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
            newMessageTime.getDate() !== prevMessageTime.getDate();
  };

  const isMyMessage = senderId => senderId === myId;

  const addMessagesOnScroll = async e => {
    if(e.target.scrollTop === 0) {
      setAddMessagesLoading(true);
      const {oldMessages} = await (await fetch(`/api/chat/${chatId}/${chatOffset}`)).json();
      // за то время, пока делали фетч, пользователь мог сменить чат, а chatId замыкается на старый.
      const currentChatId = window.location.pathname.split('/').pop();
      if(chatId === currentChatId) {
        setMessages(currentMessages => [...oldMessages, ...currentMessages]);
        setChatOffset(currentOffset => currentOffset + oldMessages.length);
      }
      setAddMessagesLoading(false);
    }
  };

  return isStartLoading ? <Spinner className="spinner_chat-main" /> :
    (
    <div className="chat-area chat-container__chat-area"
         ref={chatMessagesRef}
         onScroll={debounce(addMessagesOnScroll, 300)}
    >
      {
        isAddMessagesLoading ? <Spinner className="spinner_chat-load-messages" /> : null
      }
      {
        messages.length >  0 ? (
          messages.map(({id, text, senderId, time, status}, index) => {
            return (
              <React.Fragment key={id}>
                {
                  isNewDay(index) ? (
                    <h4 className="chat-date chat-area__chat-date">
                      {getDayInLocaleString(time)}
                    </h4>
                  ) : null
                }
                <ChatMessage
                  lastMessageRef={id === lastMessage.id ? lastMessageRef : null}
                  text={text}
                  time={getTimeInLocaleString(time)}
                  isMyMessage={isMyMessage(senderId)}
                  avatarUrl={isMyMessage(senderId) ? myAvatarUrl : sobesednikAvatarUrl}
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
  chatId: PropTypes.number.isRequired,
  currentChatInfo: PropTypes.shape({
    chatId: PropTypes.number.isRequired,
    chatType: PropTypes.oneOf(["Own", "Dialog", "Group"]),
    chatAvatarUrl: PropTypes.string.isRequired,
    chatTitle: PropTypes.string.isRequired,
    sobesednikId: 3,
    sobesednikUsername: PropTypes.string.isRequired,
    sobesednikAvatarUrl: PropTypes.string.isRequired,
    sobesednikGHUrl: PropTypes.string.isRequired,
    lastMessage: PropTypes.shape({
      id: PropTypes.number.isRequired,
      chatId: PropTypes.number.isRequired,
      senderId: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      hasAttachments: false,
      status: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired
    })
  })
};


import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';

import './chat-messages.css';

import { ChatMessage } from './ChatMessage/ChatMessage';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import {loadChatMessages} from "../../../store/slices/appSlice";
import {debounce} from "../../../utils/debounce";

// FIXME При подгрузке сообщений оставаться на том же месте, а не прыгать в начало
// TODO `Чат прокручивается до последнего сообщения если:
//          1) Мы отправляем сообщение
//          2) Мы находимся внизу чата и любой участник отправляет сообщение
//       Чат остается на том же месте при ререндере если:
//          1) Подгружаем старые сообщения
//          2) Скроллим чат (находимся не внизу чата), а другой участник отправляет сообщение
//             (Можно будет допилить и показывать кружок с количеством непрочитанных сообщений)`

const ChatMessages = ({chatId}) => {
  const dispatch = useDispatch();
  const myId = useSelector(state => state.app.currentUser.id);
  const currentChatInfo = (useSelector(state => state.app.chats))[chatId];
  const chatOffset = currentChatInfo.offset;
  const messages = currentChatInfo.messages;

  const chatMessagesRef = useRef(null);
  const lastMessageRef = useRef(null);
  const prevLastMessageRef = useRef(null);

  useEffect(() => {
    if(lastMessageRef.current && prevLastMessageRef.current !== lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
      prevLastMessageRef.current = lastMessageRef.current;
    }
  }, [chatMessagesRef.current, lastMessageRef.current]);


  useEffect(() => {
    dispatch(loadMessages());
  }, [chatId]);


  const isNewDay = index => {
    if(index === 0) return true;
    const prevMessageTime = new Date(messages[index - 1].time);
    const newMessageTime = new Date(messages[index].time);
    return  newMessageTime.getFullYear() !== prevMessageTime.getFullYear() ||
            newMessageTime.getMonth() !== prevMessageTime.getMonth() ||
            newMessageTime.getDate() !== prevMessageTime.getDate();
  };

  const isMyMessage = senderId => senderId === myId;

  const loadMessages = () => async dispatch => {
    const {oldMessages} = await (await fetch(`/api/chat/${chatId}/${chatOffset}`)).json();
    dispatch(loadChatMessages({chatId, messages: oldMessages}));
  };

  const addMessagesOnScroll = e => {
    if(e.target.scrollTop === 0) {
      dispatch(loadMessages());
    }
  };

  return (
    <>
      <ChatHeader title={currentChatInfo.chatTitle} isOnline={true} />
      <div className="chat-area chat-container__chat-area"
           ref={chatMessagesRef}
           onScroll={debounce(addMessagesOnScroll, 300)}
      >
        {
          messages.length >  0 ? (
            messages.map(({id, text, senderId, time, status}, index) => {
              return (
                <React.Fragment key={id}>
                  {
                    isNewDay(index) ? (
                      <h4 className="chat-date chat-area__chat-date">
                        {new Date(time).toLocaleDateString("ru-RU", { day: "numeric", month: "long"})}
                      </h4>
                    ) : null
                  }
                  <ChatMessage
                    lastMessageRef={index === messages.length - 1 ? lastMessageRef : null}
                    text={text}
                    time={new Date(time).toLocaleTimeString("ru-RU", {hour: "numeric", minute: "numeric"})}
                    isMyMessage={isMyMessage(senderId)}
                    status={status}
                    attachments={[]}
                  />
                </React.Fragment>
              );
            })
          ) : <p> Сообщений пока нет. </p>
        }
      </div>
    </>
  );
};

export const MemoizedChatMessages = React.memo(ChatMessages);

ChatMessages.propTypes = {
  chatId: PropTypes.number.isRequired
};


import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';

import './chat-messages.css';

import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {config} from "../../../config";
import {
  loadOldMessages,
  loadUntilFoundMessage
} from "../../../utils/chatUtils";
import {selectFoundMessage} from "../../../store/slices/appSlice/appSelectors";
import { MemoizedChatMessagesView} from "./ChatMessagesView";
import {setFoundMessage} from "../../../store/slices/appSlice/appSlice";


const ChatMessages = ({currentChat}) => {
  const {id, members, lastMessage, chatType, owner} = currentChat;

  const currentUser = useSelector(selectCurrentUser);
  const foundMessage = useSelector(selectFoundMessage);

  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [isOldMessagesLoading, setOldMessagesLoading] = useState(false);
  const [isAllMessagesLoaded, setIsAllMessagesLoaded] = useState(false);
  const [prevChatId, setPrevChatId] = useState(null);

  const fetchControllerRef = useRef(null);
  const endMessagesRef = useRef(null);
  const prevLastMessageRef = useRef(null);

  useEffect(() => {
    // Подгрузка последних сообщений чата при переключении чата
    (async () => {
      let response;
      fetchControllerRef.current = new AbortController();
      // Если найденного сообщения нет, то подгружаем LOAD_MESSAGES_THRESHOLD сообщений
      if (!foundMessage) {
        response = await loadOldMessages({
          chatId: id,
          offset: 0,
          cbOnAllLoaded: () => setIsAllMessagesLoaded(true),
          controller: fetchControllerRef.current
        });
      }
      // Иначе подгружаем сообщения до искомого
      // (Если оно находится в первых LOAD_MESSAGES_THRESHOLD сообщениях, то грузим LOAD_MESSAGES_THRESHOLD)
      else {
        response = await loadUntilFoundMessage({
          chatId: id,
          messageId: foundMessage.id,
          cbOnAllLoaded: () => setIsAllMessagesLoaded(true),
          controller: fetchControllerRef.current
        });
      }

      if (response) {
        setMessages(response.oldMessages);
        if (prevChatId !== id)
          setPrevChatId(id);
      }
    })();

    return () => {
      fetchControllerRef.current.abort();
      prevLastMessageRef.current = null;
      setIsAllMessagesLoaded(false);
    };
  }, [id, foundMessage]);

  useEffect(() => {
    setMessages(prevMessages => [...prevMessages, lastMessage]);
    if (prevLastMessageRef.current && prevLastMessageRef.current.id !== lastMessage.id)
      endMessagesRef.current.scrollIntoView({alignTop: true, behavior: "smooth"});

    prevLastMessageRef.current = lastMessage;
  }, [lastMessage]);


  useEffect(() => {
    if (!foundMessage && endMessagesRef.current && !isOldMessagesLoading) {
      endMessagesRef.current.scrollIntoView({alignTop: true, behavior: "smooth"});
    }
  });

  const addMessagesOnScroll = useCallback( async e => {
    if (
      e.target.scrollTop === 0 &&
      !isAllMessagesLoaded &&
      !isOldMessagesLoading &&
      messages.length >= config.LOAD_MESSAGES_THRESHOLD
    ) {
      setOldMessagesLoading(true);
      const response = await loadOldMessages({
        chatId: id,
        offset: messages.length,
        cbOnAllLoaded: () => setIsAllMessagesLoaded(true),
        controller: fetchControllerRef.current
      });

      if (response) {
        setMessages(laterMessages => [...response.oldMessages, ...laterMessages]);
        setOldMessagesLoading(false);
      }
    }
  }, [id, isAllMessagesLoaded, isOldMessagesLoading, messages.length]);

  return (
    <MemoizedChatMessagesView
      prevChatId={prevChatId}
      endMessagesRef={endMessagesRef}

      currentChatId={id}
      members={members}
      chatType={chatType}
      owner={owner}
      messages={messages}

      isOldMessagesLoading={isOldMessagesLoading}
      isAllMessagesLoaded={isAllMessagesLoaded}
      addMessagesOnScroll={addMessagesOnScroll}

      currentUser={currentUser}

      foundMessage={foundMessage}
    />
  );
};

export const MemoizedChatMessages = React.memo(ChatMessages);

ChatMessages.propTypes = {
  currentChat: PropTypes.shape({
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


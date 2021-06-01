import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import PropTypes from 'prop-types';

import './chat-messages.css';

import {ChatMessage} from './ChatMessage/ChatMessage';
import {throttle} from "../../../utils/throttle";
import {getDayInLocaleString, getTimeInLocaleString, isNewDay} from "../../../utils/time";
import {Spinner} from "../../UtilComponents/Spinner/Spinner";
import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {config} from "../../../config";
import {getChatStartMessage, getSobesednikAvatarUrl, isMyMessage, loadOldMessages} from "../../../utils/chatUtils";


const ChatMessages = ({currentChat}) => {
  const currentUser = useSelector(selectCurrentUser);

  const {id, members, lastMessage, chatType, owner} = currentChat;

  const [messages, setMessages] = useState([]);
  const [isOldMessagesLoading, setOldMessagesLoading] = useState(false);
  const [isAllMessagesLoaded, setIsAllMessagesLoaded] = useState(false);
  const [prevChatId, setPrevChatId] = useState(null);

  const fetchControllerRef = useRef(null);
  const endMessagesRef = useRef(null);
  const prevLastMessageRef = useRef(null);

  useEffect(() => {
    // Подгрузка последних сообщений чата при переключении чата
    fetchControllerRef.current = new AbortController();
    (async () => {
      const response = await loadOldMessages({
        chatId: id,
        offset: 0,
        cbOnAllLoaded: () => setIsAllMessagesLoaded(true),
        controller: fetchControllerRef.current
      });
      if(response) {
        setMessages(response.oldMessages);
        setPrevChatId(id);
      }
    })();

    return () => {
      fetchControllerRef.current.abort();
      prevLastMessageRef.current = null;
      setIsAllMessagesLoaded(false);
    };
  }, [id]);

  useEffect(() => {
    setMessages(prevMessages => [...prevMessages, lastMessage]);
  }, [lastMessage]);

  // TODO Придумать что-то со скролом...
  useEffect(() => {
      if (endMessagesRef.current &&
         (!prevLastMessageRef.current ||
           lastMessage !== prevLastMessageRef.current)) {
        endMessagesRef.current.scrollIntoView({alignTop: true, behavior: "smooth"});
        prevLastMessageRef.current = lastMessage;
      }
  }, [messages]);

  async function addMessagesOnScroll(e) {
    if (  e.target.scrollTop === 0 &&
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

      if(response) {
        setMessages(laterMessages => [...response.oldMessages, ...laterMessages]);
        setOldMessagesLoading(false);
      }
    }
  }

  return (
    <ul className="chat-area chat-container__chat-area" onScroll={throttle(addMessagesOnScroll, 300)}>
      {
        // если чат сменился и еще не загрузился
        prevChatId !== id ? <Spinner className="spinner_chat-main"/> : (
          <>
            {
              isOldMessagesLoading ? <Spinner className="spinner_chat-load-messages"/> :
                isAllMessagesLoaded ? (
                  <p className="chat-info-message chat-area__start-dialog-message">
                    {getChatStartMessage(chatType, currentUser.id, owner, members)}
                  </p>
                ) : null
            }
            {
              messages.map(({id, text, senderId, time, status}, index) => {
                return (
                  <React.Fragment key={id}>
                    {
                      isNewDay(messages, index) ? (
                        <h4 className="chat-info-message chat-area__date">
                          {getDayInLocaleString(time)}
                        </h4>
                      ) : null
                    }
                    <ChatMessage
                      chatType={chatType}
                      text={text}
                      time={getTimeInLocaleString(time)}
                      isMyMessage={isMyMessage(currentUser.id, senderId)}
                      avatarUrl={isMyMessage(currentUser.id, senderId) ? currentUser.avatarUrl :
                        getSobesednikAvatarUrl(members, senderId)}
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
      <div className="end-messages-ref" ref={endMessagesRef}/>
    </ul>
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


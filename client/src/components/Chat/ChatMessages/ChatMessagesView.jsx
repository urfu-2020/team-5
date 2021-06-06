/* eslint-disable react/prop-types */
import React from "react";
import {throttle} from "../../../utils/throttle";
import {Spinner} from "../../UtilComponents/Spinner/Spinner";
import {getChatStartMessage, getSobesednikAvatarUrl, isMyMessage} from "../../../utils/chatUtils";
import {getDayInLocaleString, getTimeInLocaleString, isNewDay} from "../../../utils/time";
import {ChatMessage} from "./ChatMessage/ChatMessage";


const ChatMessagesView = ({
                            addMessagesOnScroll,
                            prevChatId,
                            currentChatId,
                            members,
                            chatType,
                            owner,
                            messages,
                            currentUser,
                            isOldMessagesLoading,
                            isAllMessagesLoaded,
                            foundMessage,
                            endMessagesRef
                          }) => {

  return (
    <ul className="chat-area chat-container__chat-area" onScroll={throttle(addMessagesOnScroll, 300)}>
      {
        // если чат сменился и еще не загрузился
        prevChatId !== currentChatId ? <Spinner className="spinner_chat-main"/> : (
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
                      id={id}
                      foundMessage={foundMessage}
                      chatType={chatType}
                      text={text}
                      time={getTimeInLocaleString(time)}
                      isMyMessage={isMyMessage(currentUser.id, senderId)}
                      avatarUrl={isMyMessage(currentUser.id, senderId) ? currentUser.avatarUrl :
                        getSobesednikAvatarUrl(members, senderId)}
                      status={status}
                    />
                  </React.Fragment>
                );
              })
            }
            <div className="end-messages-ref" ref={endMessagesRef}/>
          </>
        )
      }
    </ul>
  );
};

export const MemoizedChatMessagesView = React.memo(ChatMessagesView);

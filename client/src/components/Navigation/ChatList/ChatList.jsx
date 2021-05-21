import React from 'react';

import {ChatCard} from '../ChatCard/ChatCard';
import {useSelector} from "react-redux";
import {selectCurrentChatId, selectUserChats} from "../../../store/slices/chatsSlice/chatsSelectors";

export const ChatList = () => {
  const currentChatId = useSelector(selectCurrentChatId);
  const userChats = useSelector(selectUserChats);

  return (
    <ul>
      {
        Object.values(userChats)
          // .sort((firstChat, secondChat) => {
          // const lastFirstChatMessage = firstChat.messages[firstChat.messages.length - 1];
          // const lastSecondChatMessage = secondChat.messages[secondChat.messages.length - 1];
          //
          // return new Date(lastFirstChatMessage.time) < new Date(lastSecondChatMessage.time);
          // })
          .map(({
                  id, chatType, chatAvatarUrl, chatTitle, lastMessage, sobesedniki
                }) => (
            <ChatCard
              key={id}
              chatId={id}
              chatType={chatType}
              title={chatTitle}
              avatarUrl={chatAvatarUrl}
              currentChatId={currentChatId}
              lastMessage={lastMessage}

              isOnline={false}
              countUnreadMessage={1}
            />
          ))
      }
    </ul>
  );
};

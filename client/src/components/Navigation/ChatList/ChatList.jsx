import React from 'react';

import {ChatCard} from '../ChatCard/ChatCard';
import {useSelector} from "react-redux";
import {selectCurrentChatId, selectUserChats} from "../../../store/slices/chatsSlice/chatsSelectors";
import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";

export const ChatList = () => {
  const currentChatId = useSelector(selectCurrentChatId);
  const userChats = useSelector(selectUserChats);
  const currentUserId = useSelector(selectCurrentUser).id;

  return (
    <ul>
      {
        Object.values(userChats)
          .sort((firstChat, secondChat) => {
            const lastFirstChatMessage = firstChat.lastMessage;
            const lastSecondChatMessage = secondChat.lastMessage;
            if(lastFirstChatMessage && lastSecondChatMessage) {
              return new Date(lastFirstChatMessage.time) < new Date(lastSecondChatMessage.time);
            } else if(!lastFirstChatMessage) {
              return 1;
            } else {
              return -1;
            }
          })
          .map(({
                  id, chatType, chatAvatarUrl, chatTitle, lastMessage, members
                }) => {
            if (chatType === 'Dialog') {
              const sobesednik = members.find(member => member.id !== currentUserId);
              chatAvatarUrl = sobesednik.avatarUrl;
              chatTitle = sobesednik.username;
            }
            if (chatType === 'Own') {
              chatAvatarUrl = members[0].avatarUrl;
              chatTitle = members[0].username;
            }
            return (
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
            );
          })
      }
    </ul>
  );
};

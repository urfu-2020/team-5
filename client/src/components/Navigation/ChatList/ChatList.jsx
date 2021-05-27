import React from 'react';

import {ChatCard} from '../ChatCard/ChatCard';
import {useSelector} from "react-redux";
import {selectCurrentChatId, selectUserChats} from "../../../store/slices/chatsSlice/chatsSelectors";
import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {getDialogInfo} from "../../../utils/chatUtils";

const ChatList = () => {
  const currentChatId = useSelector(selectCurrentChatId);
  const userChats = useSelector(selectUserChats);
  const currentUserId = useSelector(selectCurrentUser).id;

  return (
    <ul className="chat-list">
      {
        Object.values(userChats)
          .sort((firstChat, secondChat) => {
            const lastFirstChatMessage = firstChat.lastMessage;
            const lastSecondChatMessage = secondChat.lastMessage;
            if(lastFirstChatMessage && lastSecondChatMessage) {
              return new Date(lastFirstChatMessage.time) < new Date(lastSecondChatMessage.time) ? 1 : -1;
            } else if(!lastFirstChatMessage) {
              return 1;
            } else {
              return -1;
            }
          })
          .map(({
                  id, chatType, chatAvatarUrl, chatTitle, lastMessage, members
                }) => {
            const {dialogAvatarUrl, dialogChatTitle} = getDialogInfo(members, chatType, currentUserId);
            return (
              <ChatCard
                className="chat-list__chat-card"
                key={id}
                chatId={id}
                chatType={chatType}
                title={dialogChatTitle ? dialogChatTitle : chatTitle}
                avatarUrl={dialogAvatarUrl ? dialogAvatarUrl : chatAvatarUrl}
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

export const MemoizedChatList = React.memo(ChatList);

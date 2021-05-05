import React from 'react';

import { ChatCard } from '../ChatCard/ChatCard';
import {useSelector} from "react-redux";

export const ChatList = () => {
  const chatsInfo = useSelector(state => state.app.chats);
  const currentChatId = useSelector(state => state.app.currentChatId);

  return (
    <>
      <ul>
        <li>
          {
            Object.values(chatsInfo).map(({
                             chatId, chatType, chatAvatarUrl, chatTitle
                       }) => (
              <ChatCard
                key={chatId}
                chatId={chatId}
                title={chatTitle}
                avatarUrl={chatAvatarUrl}
                currentChatId={currentChatId}

                isOnline={true}
                lastMessage={{ text: 'TODO'}}
                countUnreadMessage={1}
              />
            ))
          }
        </li>
      </ul>
    </>
  );
};

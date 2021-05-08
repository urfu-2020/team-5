import React from 'react';

import { ChatCard } from '../ChatCard/ChatCard';
import {useSelector} from "react-redux";

export const ChatList = () => {
  const currentChatId = useSelector(state => state.app.currentChatId);
  const chatsInfo = useSelector(state => state.app.chats);

  return (
    <>
      <ul>
        <li>
          {
            Object.values(chatsInfo).map(({
                             chatId, chatType, chatAvatarUrl, chatTitle, messages
                       }) => (
              <ChatCard
                key={chatId}
                chatId={chatId}
                title={chatTitle}
                avatarUrl={chatAvatarUrl}
                currentChatId={currentChatId}
                lastMessage={messages[messages.length - 1]}

                isOnline={true}
                countUnreadMessage={1}
              />
            ))
          }
        </li>
      </ul>
    </>
  );
};

import React from 'react';

import { ChatCard } from '../ChatCard/ChatCard';
import {useSelector} from "react-redux";

export const ChatList = () => {
  const currentChatId = useSelector(state => state.chats.currentChatId);
  const chatsInfo = useSelector(state => state.chats.userChats);

  return (
    <>
      <ul>
          {
            Object.values(chatsInfo).map(({
                             chatId, chatType, chatAvatarUrl, chatTitle, messages
                       }) => (
                <ChatCard
                  key={chatId}
                  chatId={chatId}
                  chatType={chatType}
                  title={chatTitle}
                  avatarUrl={chatAvatarUrl}
                  currentChatId={currentChatId}
                  lastMessage={messages[messages.length - 1]}

                  isOnline={true}
                  countUnreadMessage={1}
                />
            ))
          }
      </ul>
    </>
  );
};

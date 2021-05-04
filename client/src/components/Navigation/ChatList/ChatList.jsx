import React from 'react';

import { ChatCard } from '../ChatCard/ChatCard';
import {useSelector} from "react-redux";

export const ChatList = () => {
  const chatsInfo = useSelector(state => state.app.chats);

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
                id={chatId}
                title={chatTitle}
                avatarUrl={chatAvatarUrl}

                isOnline={true}
                message={{ text: 'TODO'}}
                countUnreadMessage={1}
              />
            ))
          }
        </li>
      </ul>
    </>
  );
};

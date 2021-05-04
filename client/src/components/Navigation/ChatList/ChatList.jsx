import React from 'react';

import { ChatCard } from '../ChatCard/ChatCard';
import {useSelector} from "react-redux";

export const ChatList = () => {
  const chatsInfo = useSelector(state => state.app.chatsInfo);

  return (
    <>
      <ul>
        <li>
          {
            Object.values(chatsInfo).map(({
                             ChatId, ChatType, ChatAvatarUrl, ChatTitle
                       }) => (
              <ChatCard
                key={ChatId}
                id={ChatId}
                title={ChatTitle}
                avatarUrl={ChatAvatarUrl}

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

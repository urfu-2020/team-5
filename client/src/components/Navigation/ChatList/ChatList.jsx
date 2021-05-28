import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from "react-redux";

import './chat-list.css';

import {ChatCard} from '../ChatCard/ChatCard';
import {selectCurrentChatId, selectUserChats} from "../../../store/slices/chatsSlice/chatsSelectors";
import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {getDialogInfo} from "../../../utils/chatUtils";
import {tabTypes} from "../Navigation";
import {Button} from "../../UtilComponents/Button/Button";
import {setNewChannelModalOpen} from "../../../store/slices/appSlice/appSlice";


const ChatList = ({selectedTab}) => {
  const currentChatId = useSelector(selectCurrentChatId);
  const rawUserChats = Object.values(useSelector(selectUserChats));

  const dispatch = useDispatch();

  const userChats = useMemo(() => {
    return selectedTab === tabTypes.Chats ?
      rawUserChats.filter(chat => chat.type !== 'Channel') : rawUserChats.filter(chat => chat.type === 'Channel');
  }, [rawUserChats, selectedTab]);

  const currentUserId = useSelector(selectCurrentUser).id;

  return (
    <ul className={`chat-list ${userChats.length === 0 ? 'chat-list_empty' : ''}`}>
      {
        userChats.length === 0 && selectedTab === tabTypes.Channels && (
          <div className="no-channels-message">
            Вы не подписаны ни на один канал.
            <Button className="no-channels-message__new-channel-button">
              Подпишитесь
            </Button>
              или
            <Button
              className="no-channels-message__new-channel-button"
              onClick={() => dispatch(setNewChannelModalOpen(true))}
            >
              Создайте свой
            </Button>
          </div>
        )
      }
      {
        userChats && userChats
          .sort((firstChat, secondChat) => {
            const lastFirstChatMessage = firstChat.lastMessage;
            const lastSecondChatMessage = secondChat.lastMessage;
            if (lastFirstChatMessage && lastSecondChatMessage) {
              return new Date(lastFirstChatMessage.time) < new Date(lastSecondChatMessage.time) ? 1 : -1;
            } else if (!lastFirstChatMessage) {
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

ChatList.propTypes = {
  selectedTab: PropTypes.func
};

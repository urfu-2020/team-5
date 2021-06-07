import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from "react-redux";

import './chat-list.css';

import {ChatCard} from '../ChatCard/ChatCard';
import {selectCurrentChat, selectUserChats} from "../../../store/slices/chatsSlice/chatsSelectors";
import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {Button} from "../../UtilComponents/Button/Button";
import {SearchResultList} from "./SearchResultList/SearchResultList";
import {setNewChannelModalOpen, tabTypes} from "../../../store/slices/appSlice/appSlice";
import {selectSearchInputRef, selectSelectedTab} from "../../../store/slices/appSlice/appSelectors";


const ChatList = ({isSearching, searchResult}) => {
  const currentChat = useSelector(selectCurrentChat);
  const currentUserId = useSelector(selectCurrentUser).id;
  const searchInputRef = useSelector(selectSearchInputRef);
  const selectedTab = useSelector(selectSelectedTab);

  const rawUserChats = Object.values(useSelector(selectUserChats));

  const dispatch = useDispatch();

  const userChats = useMemo(() => {
    if (selectedTab === tabTypes.Chats)
      return rawUserChats.filter(chat => chat.chatType !== 'Channel');
    else return rawUserChats.filter(chat => chat.chatType === 'Channel');
  }, [rawUserChats, selectedTab]);

  return isSearching ? <SearchResultList searchResult={searchResult} isSearching={isSearching} /> : (
    <ul className={`chat-list ${userChats.length === 0 ? 'chat-list_empty' : ''}`}>
      {
        userChats.length === 0 && selectedTab === tabTypes.Channels && (
          <div className="no-channels-message">
            Вы не подписаны ни на один канал.
            <Button
              className="no-channels-message__new-channel-button"
              onClick={() => searchInputRef.current.focus()}
            >
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
          .map(chat => {
            return (
              <ChatCard
                key={chat.id}
                className="chat-list__chat-card"
                chat={chat}
                describedMessage={chat.lastMessage}
                currentChatId={currentChat ? currentChat.id : null}
                currentUserId={currentUserId}

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
  isSearching: PropTypes.bool,
  searchResult: PropTypes.func
};

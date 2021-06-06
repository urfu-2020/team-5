import React from "react";
import PropTypes from 'prop-types';
import {ChatCard} from "../../ChatCard/ChatCard";
import {useSelector} from "react-redux";
import {selectUserChats} from "../../../../store/slices/chatsSlice/chatsSelectors";

export const searchingTypes = {
  Messages: 'Messages',
  Channels: 'Channels'
};

export const SearchResultList = ({searchResult, isSearching}) => {

    const chats = useSelector(selectUserChats);

    return isSearching && searchResult && (
      <>
        <ul className="chat-list chat-list_search-result">
          <p className="search-result-header"> Найденные каналы: </p>
          {
            searchResult.channels.map(channel => {
              return (
                <ChatCard
                  searchingType={searchingTypes.Channels}
                  className="chat-list__chat-card"
                  key={channel.id}
                  chat={channel}
                  describedMessage={channel.description}
                />
              );
            })
          }
        </ul>
        <ul className="chat-list chat-list_search-result">
          <p className="search-result-header"> Найденные сообщения: </p>
          {
            searchResult.messages.map(message => {
              const chat = chats[message.chatId];
              return (
                <ChatCard
                  searchingType={searchingTypes.Messages}
                  className="chat-list__chat-card"
                  key={message.id}
                  chat={chat}
                  describedMessage={message}
                />
              );
            })
          }
        </ul>
      </>
    );
  }
;


SearchResultList.propTypes =
  {
    searchResult: PropTypes.string,
    isSearching: PropTypes.bool
  };

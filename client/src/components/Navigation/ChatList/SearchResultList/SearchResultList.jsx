import React from "react";
import PropTypes from 'prop-types';
import {ChatCard} from "../../ChatCard/ChatCard";


export const SearchResultList = ({searchResult, isSearching}) => {
  return isSearching && searchResult && (
    <div>
      <p className="search-result-header"> Найденные каналы: </p>
      <ul className="chat-list">
        {
          searchResult.map(channel => {
            return (
              <ChatCard
                isSearching={isSearching}
                className="chat-list__chat-card"
                key={channel.id}
                chat={channel}
              />
            );
          })
        }
      </ul>
    </div>
  );
}
;


SearchResultList.propTypes =
{
  searchResult: PropTypes.string,
  isSearching: PropTypes.bool
};

import React, {useRef} from 'react';

import './navigation.css';

import {NavigationHeader} from './NavigationHeader/NavigationHeader';
import {MemoizedChatList} from './ChatList/ChatList';
import {SideMenu} from "./SideMenu/SideMenu";
import {selectIsDarkTheme, selectIsSearching, selectSearchResult} from "../../store/slices/appSlice/appSelectors";
import {useSelector} from "react-redux";

export const Navigation = () => {
  const searchResult = useSelector(selectSearchResult);
  const isSearching = useSelector(selectIsSearching);
  const isDarkTheme = useSelector(selectIsDarkTheme);

  const searchInputRef = useRef();

  return (
  <nav className={`navigation ${isDarkTheme ? 'navigation_dark' : ''} ${isSearching ? "navigation_searching" : ''}`}>
      <NavigationHeader
        isSearching={isSearching}
        searchInputRef={searchInputRef}
      />
      <MemoizedChatList
        searchInputRef={searchInputRef}
        isSearching={isSearching}
        searchResult={searchResult}
      />
      <SideMenu />
    </nav>
  );
};

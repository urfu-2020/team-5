import React, {useRef, useState} from 'react';

import './navigation.css';

import {NavigationHeader} from './NavigationHeader/NavigationHeader';
import {MemoizedChatList} from './ChatList/ChatList';
import {SideMenu} from "./SideMenu/SideMenu";
import {selectIsDarkTheme, selectIsSearching, selectSearchResult} from "../../store/slices/appSlice/appSelectors";
import {useSelector} from "react-redux";

export const tabTypes = {
  Chats: 'Chats',
  Channels: 'Channels'
};

export const Navigation = () => {
  const [isSideMenuOpen, setOpenSideMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabTypes.Chats);
  const searchResult = useSelector(selectSearchResult);
  const isSearching = useSelector(selectIsSearching);
  const isDarkTheme = useSelector(selectIsDarkTheme);

  const searchInputRef = useRef();

  return (
  <nav className={`navigation ${isDarkTheme ? 'navigation_dark' : ''} ${isSearching ? "navigation_searching" : ''}`}>
      <NavigationHeader
        searchInputRef={searchInputRef}
        isSearching={isSearching}
        setOpenSideMenu={setOpenSideMenu}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <MemoizedChatList
        searchInputRef={searchInputRef}
        isSearching={isSearching}
        searchResult={searchResult}
        selectedTab={selectedTab}
      />
      <SideMenu
          isSideMenuOpen={isSideMenuOpen}
          setOpenSideMenu={setOpenSideMenu}
        />
    </nav>
  );
};

import React, {useRef, useState} from 'react';

import './navigation.css';

import {NavigationHeader} from './NavigationHeader/NavigationHeader';
import {MemoizedChatList} from './ChatList/ChatList';
import {SideMenu} from "./SideMenu/SideMenu";
import {selectIsSearching, selectSearchResult} from "../../store/slices/appSlice/appSelectors";
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

  const searchInputRef = useRef();

  return (
    <>
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
    </>
  );
};

import React, {useState} from 'react';

import './navigation.css';

import {NavigationHeader} from './NavigationHeader/NavigationHeader';
import {MemoizedChatList} from './ChatList/ChatList';
import {SideMenu} from "./SideMenu/SideMenu";

export const tabTypes = {
  Chats: 'Chats',
  Channels: 'Channels'
};

export const Navigation = () => {
  const [isSideMenuOpen, setOpenSideMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabTypes.Chats);

  return (
    <>
      <NavigationHeader
        setOpenSideMenu={setOpenSideMenu}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <MemoizedChatList
        selectedTab={selectedTab}
      />
      <SideMenu
          isSideMenuOpen={isSideMenuOpen}
          setOpenSideMenu={setOpenSideMenu}
        />
    </>
  );
};

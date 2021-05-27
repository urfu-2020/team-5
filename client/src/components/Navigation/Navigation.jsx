import React, {useState} from 'react';

import './navigation.css';

import {NavigationHeader} from './NavigationHeader/NavigationHeader';
import {MemoizedChatList} from './ChatList/ChatList';
import {SideMenu} from "./SideMenu/SideMenu";

export const Navigation = () => {
  const [isSideMenuOpen, setOpenSideMenu] = useState(false);

  return (
    <>
      <NavigationHeader setOpenSideMenu={setOpenSideMenu} />
      <MemoizedChatList />
      <SideMenu
          isSideMenuOpen={isSideMenuOpen}
          setOpenSideMenu={setOpenSideMenu}
        />
    </>
  );
};

import React from 'react';

import './navigation.css';

import { NavigationHeader } from './NavigationHeader/NavigationHeader';
import { ChatList } from './ChatList/ChatList';

export const Navigation = () => (
  <>
    <NavigationHeader />
    <ChatList />
  </>
);

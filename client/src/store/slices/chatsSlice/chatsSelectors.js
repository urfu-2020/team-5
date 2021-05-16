import {createSelector} from "@reduxjs/toolkit";

export const selectChats = state => state.chats;

export const selectUserChats = createSelector(
  selectChats,
  chats => chats.userChats
);

export const selectCurrentChatId = createSelector(
  selectChats,
  chats => chats.currentChatId
);

export const makeSelectCurrentChat = () => createSelector(
  selectUserChats,
  (_, chatId) => chatId,
  (userChats, chatId) => userChats[chatId]
);


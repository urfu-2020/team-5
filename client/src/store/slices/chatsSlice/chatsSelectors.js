import {createSelector} from "@reduxjs/toolkit";

const selectChats = state => state.chats;

export const selectUserChats = createSelector(
  selectChats,
  chats => chats.userChats
);

export const selectCurrentChat = createSelector(
  selectChats,
  chats => chats.currentChat
);

export const selectIsChatsDataLoading = createSelector(
  selectChats,
  chats => chats.isChatsDataLoading
);

export const selectIsSubscribing = createSelector(
  selectChats,
  chats => chats.IsSubscribing
);


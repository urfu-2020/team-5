import {createAsyncThunk} from "@reduxjs/toolkit";
import {convertRawStartChatsData} from "../../../utils/convertRawStartChatsData";
import {config} from "../../../config";

export const setChatsData = createAsyncThunk('chats/createChatsData', async (userId) => {
  const {rawChatsInfo, lastMessages} = await (await fetch(`/user/${userId}/chatsData`)).json();
  return convertRawStartChatsData(rawChatsInfo, lastMessages);
});

export const loadOldMessages = createAsyncThunk('chats/loadOldMessages', async ({chatId, offset, cbOnAllLoaded}) => {
  const {LOAD_MESSAGES_THRESHOLD} = config;
  const {oldMessages} = await (await fetch(`/api/chat/${chatId}/${offset}/${LOAD_MESSAGES_THRESHOLD}`)).json();
  if (oldMessages.length < LOAD_MESSAGES_THRESHOLD) {
    cbOnAllLoaded();
  }

  return {chatId, messages: oldMessages};
});

export const loadStartChatMessages = createAsyncThunk('chats/loadStartChatMessages',
  async ({chatId, cbOnAllLoaded}) => {
    return loadOldMessages({chatId, offset: 1, cbOnAllLoaded});
  });

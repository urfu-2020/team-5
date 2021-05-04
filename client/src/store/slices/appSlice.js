import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  currentChatId: null,
  chats: {}
};

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setCurrentUser(state, {payload}) {
      state.currentUser = payload;
    },
    setChatsData(state, {payload}) {
      state.chats = payload;
    },
    addChatMessage(state, {payload}) {
      state.chats[payload.chatId].messages.push(payload);
    },
    setCurrentChatId(state, {payload}) {
      state.currentChatId = payload;
    }
  }
});

const { actions, reducer } = appSlice;

export const { setCurrentUser, setChatsData, addChatMessage, setCurrentChatId } = actions;

export default reducer;

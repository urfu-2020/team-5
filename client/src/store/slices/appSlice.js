import {createSlice} from '@reduxjs/toolkit';

/**
 *
 * @type {{currentUser: UserModel | null, chatsMessages: {number: ChatModel}, chatsInfo: {number: Array<MessageModel>}}}
 */
const initialState = {
  currentUser: null,
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
    }
  }
});

const { actions, reducer } = appSlice;

export const { setCurrentUser, setChatsData, addChatMessage } = actions;

export default reducer;

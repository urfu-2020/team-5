import {createSlice} from '@reduxjs/toolkit';


class AppState {
  /**
   *
   * @param currentUser {UserModel}
   * @param currentChatId {number}
   * @param chats {{ number: ChatModel }}
   */
  constructor(currentUser, currentChatId, chats) {
    this.currentUser = currentUser;
    this.currentChatId = currentChatId;
    this.chats = chats;
  }
}

/**
 * @type AppState
 */
const initialState = {
  currentUser: null,
  currentChatId: null,
  chats: {}
};

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: UserModel }}
     */
    setCurrentUser(state, {payload}) {
      state.currentUser = payload;
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: { number: ChatModel } }}
     */
    setChatsData(state, {payload}) {
      state.chats = payload;
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: MessageModel }}
     */
    addChatMessage(state, {payload}) {
      state.chats[payload.chatId].messages.push(payload);
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: { chatId: number, messages: Array<MessageModel> }}}
     */
    loadChatMessages(state, {payload}) {
      state.chats[payload.chatId].messages.unshift(...payload.messages);
      state.chats[payload.chatId].offset = state.chats[payload.chatId].offset + payload.messages.length;
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: number }}}
     */
    setCurrentChatId(state, {payload}) {
      state.currentChatId = payload;
    }
  }
});

const { actions, reducer } = appSlice;

export const {
  setCurrentUser,
  setChatsData,
  addChatMessage,
  setCurrentChatId,
  loadChatMessages
} = actions;

export default reducer;

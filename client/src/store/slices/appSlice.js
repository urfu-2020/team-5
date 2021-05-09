import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {convertRawStartChatsData} from "../../utils/convertRawStartChatsData";
import {config} from "../../config";

export const loadingStateEnum = {
  APP_LOADING: 'APP_LOADING',
  CHAT_LOADING: 'CHAT_LOADING',
  MESSAGES_LOADING: 'MESSAGES_LOADING'
};

class AppState {
  /**
   *
   * @param currentUser {UserModel}
   * @param currentChatId {number}
   * @param chats {{ number: ChatModel }}
   * @param loadingState { ('APP_LOADING' |
   *                        'CHAT_LOADING' |
   *                        'MESSAGES_LOADING') }
   */
  constructor(currentUser, currentChatId, chats, loadingState) {
    this.currentUser = currentUser;
    this.currentChatId = currentChatId;
    this.chats = chats;
    this.loadingState = loadingState;
  }
}

export const setCurrentUser = createAsyncThunk('user/setCurrentUser', async () => {
  const {user} = await (await fetch('/user/self')).json();
  return user;
});

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

/**
 * @type AppState
 */
const initialState = {
  currentUser: null,
  currentChatId: null,
  chats: {},
  loadingState: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: MessageModel }}
     */
    addChatMessage(state, {payload}) {
      state.chats[payload.chatId].messages.push(payload);
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: number }}}
     */
    setCurrentChatId(state, {payload}) {
      state.currentChatId = payload;
    }
  },
  extraReducers: {
    [setCurrentUser.pending]: (state) => {
      state.loadingState = loadingStateEnum.APP_LOADING;
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: UserModel }}
     */
    [setCurrentUser.fulfilled]: (state, {payload}) => {
      state.currentUser = payload;
      state.loadingState = null;
    },

    [setChatsData.pending]: (state) => {
      state.loadingState = loadingStateEnum.APP_LOADING;
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: { number: ChatModel } }}
     */
    [setChatsData.fulfilled]: (state, {payload}) => {
      state.chats = payload;
      state.loadingState = null;
    },
    [loadStartChatMessages.pending]: (state) => {
      state.loadingState = loadingStateEnum.CHAT_LOADING;
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: {chatId: number, messages: Array<MessageModel>} }}
     */
    [loadStartChatMessages.fulfilled]: (state, {payload}) => {
      state.chats[payload.chatId].messages.unshift(...payload.messages);
      state.loadingState = null;
    },
    [loadOldMessages.pending]: (state) => {
        state.loadingState = loadingStateEnum.MESSAGES_LOADING;
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: {chatId: number, messages: Array<MessageModel>} }}
     */
    [loadOldMessages.fulfilled]: (state, {payload}) => {
      state.chats[payload.chatId].messages.unshift(...payload.messages);
      state.loadingState = null;
    }
  }
});



const { actions, reducer } = appSlice;

export const {
  addChatMessage,
  setCurrentChatId,
} = actions;

export default reducer;

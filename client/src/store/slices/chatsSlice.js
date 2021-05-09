import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {convertRawStartChatsData} from "../../utils/convertRawStartChatsData";
import {config} from "../../config";


class ChatsState {
  /**
   *
   * @param currentChatId {number}
   * @param userChats {{ number: ChatModel }}
   * @param isChatsDataLoading {boolean}
   * @param isChatLoading {boolean}
   * @param isOldMessagesLoading {boolean}
   */
  constructor(currentChatId, userChats, isChatsDataLoading, isChatLoading, isOldMessagesLoading) {
    this.currentChatId = currentChatId;
    this.userChats = userChats;
    this.isChatsDataLoading = isChatsDataLoading;
    this.isChatLoading = isChatLoading;
    this.isOldMessagesLoading = isOldMessagesLoading;
  }
}

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
 * @type ChatsState
 */
const initialChatsState = {
  currentChatId: null,
  userChats: {},
  isChatsDataLoading: true,
  isChatLoading: false,
  isOldMessagesLoading: false
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState: initialChatsState,
  reducers: {
    /**
     * @param state {ChatsState}
     * @param action {{ type: string, payload: MessageModel }}
     */
    addChatMessage(state, {payload}) {
      state.userChats[payload.chatId].messages.push(payload);
    },
    /**
     * @param state {ChatsState}
     * @param action {{ type: string, payload: number }}}
     */
    setCurrentChatId(state, {payload}) {
      state.currentChatId = payload;
    }
  },
  extraReducers: {
    [setChatsData.pending]: (state) => {
      state.isChatsDataLoading = true;
    },
    /**
     * @param state {ChatsState}
     * @param action {{ type: string, payload: { number: ChatModel } }}
     */
    [setChatsData.fulfilled]: (state, {payload}) => {
      state.userChats = payload;
      state.isChatsDataLoading = false;
    },
    [loadStartChatMessages.pending]: (state) => {
      state.isChatLoading = true;
    },
    /**
     * @param state {ChatsState}
     * @param action {{ type: string, payload: {chatId: number, messages: Array<MessageModel>} }}
     */
    [loadStartChatMessages.fulfilled]: (state, {payload}) => {
      state.userChats[payload.chatId].messages.unshift(...payload.messages);
      state.isChatLoading = false;
    },
    [loadOldMessages.pending]: (state) => {
      state.isOldMessagesLoading = true;
    },
    /**
     * @param state {ChatsState}
     * @param action {{ type: string, payload: {chatId: number, messages: Array<MessageModel>} }}
     */
    [loadOldMessages.fulfilled]: (state, {payload}) => {
      state.userChats[payload.chatId].messages.unshift(...payload.messages);
      state.isOldMessagesLoading = false;
    }
  }
});



const { actions, reducer } = chatsSlice;

export const {
  addChatMessage,
  setCurrentChatId,
} = actions;

export default reducer;

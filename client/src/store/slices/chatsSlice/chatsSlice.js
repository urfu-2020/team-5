import {createSlice} from '@reduxjs/toolkit';
import {loadOldMessages, setChatsData} from "./chatsThunks";


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
  setCurrentChatId
} = actions;

export default reducer;

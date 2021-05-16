import {createSlice} from '@reduxjs/toolkit';
import {setChatsData} from "./chatsThunks";


class ChatsState {
  /**
   *
   * @param currentChatId {number}
   * @param userChats {{ number: ChatModel }}
   * @param isChatsDataLoading {boolean}
   */
  constructor(currentChatId, userChats, isChatsDataLoading) {
    this.currentChatId = currentChatId;
    this.userChats = userChats;
    this.isChatsDataLoading = isChatsDataLoading;
  }
}

/**
 * @type ChatsState
 */
const initialChatsState = {
  currentChatId: null,
  userChats: {},
  isChatsDataLoading: true
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
      state.userChats[payload.chatId].lastMessage = payload;
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
    }
  }
});



const { actions, reducer } = chatsSlice;

export const {
  addChatMessage,
  setCurrentChatId
} = actions;

export default reducer;

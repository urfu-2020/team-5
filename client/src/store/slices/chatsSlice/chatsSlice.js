import {createSlice} from '@reduxjs/toolkit';
import {convertRawNewDialog, convertRawStartChatsData} from "../../../utils/chatConverters";


class ChatsState {
  /**
   *
   * @param currentChatId {number}
   * @param userChats {Object.<number, ChatModel>}
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
     * Установить инфу о чатах после логина + в каждом по последнему сообщению
     * @param state {ChatsState}
     * @param action {{ type: string, payload: { userChats: Array<UserChatModel>, lastMessages: Array<MessageModel>} }}
     */
    setChatsData(state, {payload}) {
      const {userChats, lastMessages} = payload;
      state.userChats = convertRawStartChatsData(userChats, lastMessages);
      state.isChatsDataLoading = false;
    },
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
    },
    addNewChat(state, {payload}) {
      const newChat = convertRawNewDialog(payload);
      state.userChats[newChat.chatId] = newChat;
    }
  }
});



const { actions, reducer } = chatsSlice;

export const {
  setChatsData,
  addNewChat,
  addChatMessage,
  setCurrentChatId
} = actions;

export default reducer;

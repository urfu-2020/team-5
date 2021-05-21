import {createSlice} from '@reduxjs/toolkit';
import {convertRawStartChatsData, getNewChat} from "../../../utils/chatConverters";


class ChatsState {
  /**
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
     * @param action {{ type: string, payload:
     * { userChats: Array<ChatInDbModel>, chatSobesedniki: Array<UserChatModel>, lastMessages: Array<MessageModel>} }}
     */
    setChatsData(state, {payload}) {
      const {userChats, chatSobesedniki, lastMessages} = payload;
      state.userChats = convertRawStartChatsData(userChats, chatSobesedniki, lastMessages);
      state.isChatsDataLoading = false;
    },
    /**
     * Обновить последнее сообщение в чате с id === ${action.payload.chatId}
     * @param state {ChatsState}
     * @param action {{ type: string, payload: MessageModel }}
     */
    addChatMessage(state, {payload}) {
      state.userChats[payload.chatId].lastMessage = payload;
    },
    /**
     * Обновить текущий чат
     * @param state {ChatsState}
     * @param action {{ type: string, payload: number }}
     */
    setCurrentChatId(state, {payload}) {
      state.currentChatId = payload;
    },
    /**
     * Добавить диалог с новым пользователем
     * @param state {ChatsState}
     * @param action {{chat: ChatInDbModel, sobesedniki: Array<UserChatModel>}}
     */
    addNewChat(state, {payload}) {
      const {chat, chatSobesedniki} = payload;
      const newChat = getNewChat(chat, chatSobesedniki);
      state.userChats[newChat.id] = newChat;
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
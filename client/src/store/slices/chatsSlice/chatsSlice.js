import {createSlice} from '@reduxjs/toolkit';
import {convertRawStartChatsData} from "../../../utils/chatConverters";


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

const chatsSlice = createSlice({
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
      const {userChats, chatUserRecords, lastMessages} = payload;
      state.userChats = convertRawStartChatsData(userChats, chatUserRecords, lastMessages);
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
     * @param action {{chat: ChatInDbModel, sobesedniki: Array<UserModel>}}
     */
    addNewChat(state, {payload}) {
      console.log(payload);
      const {chat} = payload;
      state.userChats[chat.id] = chat;
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

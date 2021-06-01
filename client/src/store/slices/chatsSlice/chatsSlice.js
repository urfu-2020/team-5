import {createSlice} from '@reduxjs/toolkit';
import {convertRawStartChatsData} from "../../../utils/chatConverters";


class ChatsState {
  /**
   * @param currentChat {ChatModel}
   * @param userChats {Object.<number, ChatModel>}
   * @param isChatsDataLoading {boolean}
   * @param isSubscribing {boolean}
   */
  constructor(currentChat, userChats, isChatsDataLoading, isSubscribing) {
    this.currentChat = currentChat;
    this.userChats = userChats;
    this.isChatsDataLoading = isChatsDataLoading;
    this.isSubscribing = isSubscribing;
  }
}


const initialChatsState = {
  currentChat: null,
  userChats: {},
  isChatsDataLoading: true,
  isSubscribing: false
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
      // Если это канал, на который мы не подписаны, то его не будет в редаксе
      if (state.userChats[payload.chatId]) {
        state.userChats[payload.chatId].lastMessage = payload;
      }
      if (state.currentChat && state.currentChat.id === payload.chatId)
        state.currentChat.lastMessage = payload;
    },
    /**
     * Обновить текущий чат
     * @param state {ChatsState}
     * @param action {{ type: string, payload: ChatModel }}
     */
    setCurrentChat(state, {payload}) {
      state.currentChat = state.userChats[payload];
    },
    /**
     * Обновить текущий чат на канал, которого нет в редаксе
     * @param state {ChatsState}
     * @param action {{ type: string, payload: ChatModel }}
     */
    setCurrentUnsubscribeChannel(state, {payload}) {
      state.currentChat = payload;
    },
    /**
     * Добавить диалог с новым пользователем
     * @param state {ChatsState}
     * @param payload {{chat: ChatModel}}
     */
    addNewChat(state, {payload}) {
      const {chat} = payload;
      state.userChats[chat.id] = chat;
    },
    /**
     * Выйти из чата / отписаться от канала
     * @param state {ChatsState}
     * @param payload: {number}
     */
    leaveFromChat(state, {payload}) {
      delete state.userChats[payload];
    },
    /**
     * Для отображения индикатора загрузки на кнопке "Подписаться/Отписаться" в канале
     * @param state {ChatsState}
     * @param payload {boolean}
     */
    setIsSubscribing(state, {payload}) {
      state.isSubscribing = payload;
    }
  }
});



const { actions, reducer } = chatsSlice;

export const {
  setChatsData,
  addNewChat,
  addChatMessage,
  setCurrentChat,
  setCurrentUnsubscribeChannel,
  setIsSubscribing,
  leaveFromChat
} = actions;

export default reducer;

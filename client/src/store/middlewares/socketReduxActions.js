export const INIT_SOCKET = 'socket/init';
export const ADD_DIALOGS_WITH_NEW_USER = 'socket/addDialogsWithNewUser';
export const CREATE_NEW_CHAT = 'socket/createNewChat';
export const SEND_MESSAGE = 'socket/sendMessage';
export const CREATE_NEW_CHANNEL = 'socket/createNewChannel';
export const SET_UNSUBSCRIBED_CHANNEL = 'socket/setUnsubscribedChannel';
export const SUBSCRIBE_TO_CHANNEL = 'socket/subscribeToChannel';
export const UNSUBSCRIBE_FROM_CHANNEL = 'socket/unsubscribeFromChannel';

/**
 * Создать сокет подключение
 * @returns {{type: string}}
 */
export const initSocket = () => ({type: INIT_SOCKET});

/**
 * Отправить запрос на создание у всех пользователей диалога с новым пользователем
 * @returns {{type: string}}
 */
export const addDialogsWithNewUser = () => ({ type: ADD_DIALOGS_WITH_NEW_USER });

/**
 * Отправить запрос на создание нового чата
 * @param chatTitle {String}
 * @param selectedUsers {String}
 * @returns {{payload: {chatTitle, selectedUsers}, type: string}}
 */
export const createNewChat =
  (chatTitle, selectedUsers) => ({type: CREATE_NEW_CHAT, payload: {chatTitle, selectedUsers}});

/**
 * Отправить запрос на создание нового канала
 * @param channelTitle {String}
 * @param channelDescription {String}
 * @returns {{payload: {channelDescription: String, channelTitle: String}}}
 */
export const createNewChannel =
  (channelTitle, channelDescription) => ({type: CREATE_NEW_CHANNEL, payload: {channelTitle, channelDescription}});


/**
 * Отправить сообщение
 * @param payload
 * @return {{payload, type: string}}
 */
export const sendMessage = payload => ({type: SEND_MESSAGE, payload});


/**
 * Открыть канал, на который нет подписки
 */
export const setUnsubscribedChannel = chatId => ({ type: SET_UNSUBSCRIBED_CHANNEL, payload: chatId });


export const subscribeToChannel = chatId => ({ type: SUBSCRIBE_TO_CHANNEL, payload: chatId });

export const unsubscribeFromChannel = chatId => ({ type: UNSUBSCRIBE_FROM_CHANNEL, payload: chatId });

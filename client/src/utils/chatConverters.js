/**
 * Получить чат (в представлении фронта) без собеседников
 * @param userChat {UserChatModel}
 * @returns {ChatModel}
 */
function getNewChat(userChat) {
  const {
    chatId, chatType, sobesednikAvatarUrl, sobesednikUsername
  } = userChat;
  let {chatAvatarUrl, chatTitle} = userChat;
  if (chatType === 'Own' || chatType === 'Dialog') {
    chatAvatarUrl = sobesednikAvatarUrl;
    chatTitle = sobesednikUsername;
  }

  return {
    chatId,
    chatType,
    chatAvatarUrl,
    chatTitle,
    sobesedniki: []
  };
}

/**
 * При подключении нового юзера создается чат с ним.
 * Здесь парсятся данные с бэка для фронта
 * @param userChat {UserChatModel}
 * @returns {ChatModel}
 */
export function convertRawNewDialog(userChat) {
  const newChat = getNewChat(userChat);
  newChat.sobesedniki.push(
    {
      id: userChat.sobesednikId,
      username: userChat.sobesednikUsername,
      avatarUrl: userChat.sobesednikAvatarUrl,
      githubUrl: userChat.sobesednikGHUrl
    }
  );
  return newChat;
}

/**
 * Преобразование стартовых данных, пришедших с бэка (из бд), в нужные для фронта
 * @param rawChatsInfo {Array<UserChatModel>} записи чат-собеседник
 * @param lastMessages {Array<MessageModel>} последние сообщения в каждом из чатов
 * @returns {ChatModel}
 */
export function convertRawStartChatsData(rawChatsInfo, lastMessages) {
  const chats = {};
  rawChatsInfo.forEach((userChat) => {
    if (!chats[userChat.chatId]) {
      chats[userChat.chatId] = getNewChat(userChat);
    }
    chats[userChat.chatId].sobesedniki.push(
      {
        id: userChat.sobesednikId,
        username: userChat.sobesednikUsername,
        avatarUrl: userChat.sobesednikAvatarUrl,
        githubUrl: userChat.sobesednikGHUrl
      }
    );
  });
  lastMessages.forEach((message) => {
    chats[message.chatId].lastMessage = message;
  });

  return chats;
}

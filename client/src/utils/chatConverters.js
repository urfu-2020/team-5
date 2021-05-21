/**
 * Получить чат (в представлении фронта)
 * @param chat {ChatInDbModel}
 * @param chatSobesedniki {Array<UserChatModel>}
 * @returns {ChatModel}
 */
export function getNewChat(chat, chatSobesedniki) {

  // находим собеседников, которые есть в этом чате
  const sobesedniki = chatSobesedniki.filter(cs => cs.chatId === chat.id)
    .map(cs => ({
      id: cs.sobesednikId,
      username: cs.sobesednikUsername,
      avatarUrl: cs.sobesednikAvatarUrl,
      githubUrl: cs.sobesednikGHUrl
    }));

  if (chat.chatType === 'Own' || chat.chatType === 'Dialog') {
    const sobesednik = sobesedniki[0];
    chat.chatAvatarUrl = sobesednik.avatarUrl;
    chat.chatTitle = sobesednik.username;
  }

  return {
    ...chat,
    sobesedniki
  };
}

/**
 * Преобразование стартовых данных, пришедших с бэка (из бд), в нужные для фронта
 * @param rawChatsInfo {Array<ChatInDbModel>} чаты, в которых есть пользователь
 * @param chatSobesedniki {Array<UserChatModel>} chatId-собеседник
 * @param lastMessages {Array<MessageModel>} последние сообщения в каждом из чатов
 * @returns {ChatModel}
 */
export function convertRawStartChatsData(rawChatsInfo, chatSobesedniki, lastMessages) {
  const chats = {};
  rawChatsInfo.forEach(chat => {
    chats[chat.id] = getNewChat(chat, chatSobesedniki);
  });

  lastMessages.forEach((message) => {
    chats[message.chatId].lastMessage = message;
  });

  return chats;
}

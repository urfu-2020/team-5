/**
 * Получить чат (в представлении фронта)
 * @param chat {ChatInDbModel}
 * @param chatUserRecords {Array<UserChatModel>}
 * @returns {ChatModel} без lastMessages
 */
function getNewChatFromChatUserRecords(chat, chatUserRecords) {
  // находим собеседников, которые есть в этом чате
  const members = chatUserRecords.filter(cs => cs.chatId === chat.id)
    .map(chatUserRecord => {
      const {chatId, userId, ...member} = chatUserRecord;
      return {
        ...member,
        id: userId
      };
    });
  return {
    ...chat,
    owner: members.find(member => member.id === chat.owner),
    members
  };
}

/**
 * Преобразование стартовых данных, пришедших с бэка (из бд), в нужные для фронта
 * @param rawChatsInfo {Array<ChatInDbModel>} чаты, в которых есть пользователь
 * @param chatUserRecords {Array<UserChatModel>} chatId-собеседник
 * @param lastMessages {Array<MessageModel>} последние сообщения в каждом из чатов
 * @returns {ChatModel}
 */
export function convertRawStartChatsData(rawChatsInfo, chatUserRecords, lastMessages) {
  const chats = {};
  rawChatsInfo.forEach(chat => {
    chats[chat.id] = getNewChatFromChatUserRecords(chat, chatUserRecords);
  });

  lastMessages.forEach((message) => {
    chats[message.chatId].lastMessage = message;
  });

  return chats;
}

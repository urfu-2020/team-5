const mssql = require('mssql');

const CONNECTION_URL = process.env.DATABASE_CONNECTION_STRING;

/**
 *
 * @param query {string}
 * @returns {Promise<void|Promise>}
 */
async function dbRequest(query) {
  try {
    const request = (await mssql.connect(CONNECTION_URL)).request();
    return request.query(query);
  } catch (e) {
    return console.error(e);
  }
}

/**
 * @returns {Array<UserModel> | boolean}
 */
async function getUsers() {
  return (await dbRequest('SELECT * FROM [User]')).recordset;
}

/**
 * @param username {String}
 * @returns {UserModel | boolean}
 */
async function getUserByName(username) {
  const queryArr = (await dbRequest(`SELECT * FROM [User] WHERE username='${username}'`)).recordset;
  if (queryArr.length === 0) return false;
  return queryArr[0];
}

/**
 * @param username {String}
 * @param avatarUrl {String}
 * @param githubUrl {String}
 */
async function createUser(username, avatarUrl, githubUrl) {
  await dbRequest(`INSERT INTO [User](username, avatarUrl, githubUrl)
                          VALUES ('${username}', '${avatarUrl}', '${githubUrl}')`);
}

/**
 * @param username {String}
 */
async function addDialogsWithNewUser(username) {
  await dbRequest(`EXEC AddDialogsWithNewUser @newUserUsername='${username}'`);
}

/**
 * Получить информацию о чатах пользователя, (если это диалог или чат с собой,
 * то название чата и ава соответсвуют собеседнику)
 * @param userId {Number}
 * @returns Array<ChatModel>
 */
async function getUserChats(userId) {
  return (await dbRequest(`SELECT * FROM GetUserChats(${userId})`)).recordset
    .map((rawChat) => ({
      ...rawChat,
      chatTitle: rawChat.chatType === 'Group' ? rawChat.chatTitle : rawChat.sobesednikUsername,
      chatAvatarUrl: rawChat.chatType === 'Group' ? rawChat.chatAvatarUrl : rawChat.sobesednikAvatarUrl,
    }));
}

/**
 * Получить следующие ${take} сообщений чата, начиная с ${offset}
 * @param chatId {number}
 * @param offset {number}
 * @param take {number}
 * @returns Array<MessageModel>
 */
async function getChatMessages(chatId, offset, take) {
  return (await dbRequest(`SELECT * FROM GetChatMessages(${chatId}, ${offset}, ${take})`)).recordset;
}

/**
 * Получить последние сообщения из всех чатов, в которых есть пользователь (когда входим первый раз)
 * @param userId {number}
 * @returns Array<MessageModel>
 */
async function getUserLastChatMessages(userId) {
  return (await dbRequest(`SELECT * FROM GetUserLastChatMessages(${userId})`)).recordset;
}

/**
 * Положить сообщение в бд
 * @returns number
 */
async function storeChatMessage({
  messageId, chatId, senderId, text, hasAttachments, status, time
}) {
  await dbRequest(`
    EXEC StoreChatMessage
      @messageId='${messageId}',
      @chatId=${chatId},
      @senderId=${senderId},
      @text='${text}',
      @hasAttachments=${hasAttachments},
      @status='${status}',
      @time='${time}'
    `);

  return true;
}

module.exports = {
  getUsers,
  getUserByName,
  createUser,
  addDialogsWithNewUser,
  getUserChats,
  storeChatMessage,
  getChatMessages,
  getUserLastChatMessages
};

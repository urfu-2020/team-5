const mssql = require('mssql');

const CONNECTION_URL = process.env.DATABASE_CONNECTION_STRING;

/**
 * Запрос в бд
 * @param query {string} строка запроса
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
 * Получить всех пользователей
 * @returns {Array<UserModel>}
 */
async function getUsers() {
  return (await dbRequest('SELECT * FROM [User]')).recordset;
}

/**
 * Получить пользователя по условию
 * @param column {String} название атрибута в бд
 * @param value {String | number} значение атрибута
 * @returns {UserModel | boolean}
 */
async function getUser(column, value) {
  const resValue = typeof value === 'number' ? value : `'${value}'`;
  const query = `SELECT * FROM [User] WHERE ${column}=${resValue}`;
  const queryArr = (await dbRequest(query)).recordset;
  if (queryArr.length === 0) return false;
  return queryArr[0];
}

/**
 * Создать пользователя в бд
 * @param username {String}
 * @param avatarUrl {String}
 * @param githubUrl {String}
 */
async function createUser(username, avatarUrl, githubUrl) {
  await dbRequest(`INSERT INTO [User](username, avatarUrl, githubUrl)
                          VALUES ('${username}', '${avatarUrl}', '${githubUrl}')`);
}

/**
 * Добавить диалоги с пользователем, который в первый раз зашел
 * @param username {String}
 */
async function addDialogsWithNewUser(username) {
  await dbRequest(`EXEC AddDialogsWithNewUser @newUserUsername='${username}'`);
}

/**
 * Получить записи вида чат-собеседник о чатах, в которых есть пользователь с userId
 * @param userId {Number}
 * @returns Array<UserChatModel>
 */
async function getUserChats(userId) {
  return (await dbRequest(`SELECT * FROM GetUserChats(${userId})`)).recordset;
}

/**
 * Получить id чатов, в которых есть пользователь
 * @param userId
 * @returns {Promise<*>}
 */
async function getUserChatsIds(userId) {
  return (await dbRequest(`SELECT * FROM GetUserChatsIds(${userId})`)).recordset.map((obj) => obj.chatId);
}

/**
 * Получить из ${chatId} следующие ${take} сообщений чата, начиная с ${offset}
 * @param chatId {number}
 * @param offset {number}
 * @param take {number}
 * @returns Array<MessageModel>
 */
async function getChatMessages(chatId, offset, take) {
  return (await dbRequest(`SELECT * FROM GetChatMessages(${chatId}, ${offset}, ${take})`)).recordset;
}

/**
 * Получить последние сообщения из всех чатов, в которых есть пользователь (для начальных данных о чатах)
 * @param userId {number}
 * @returns Array<MessageModel>
 */
async function getUserLastChatMessages(userId) {
  return (await dbRequest(`SELECT * FROM GetUserLastChatMessages(${userId})`)).recordset;
}

/**
 * Положить сообщение в бд
 * @param {MessageModel}
 * @returns {Promise<boolean>}
 */
async function storeChatMessage({
  id, chatId, senderId, text, hasAttachments, status, time
}) {
  await dbRequest(`
    EXEC StoreChatMessage
      @messageId='${id}',
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
  getUser,
  createUser,
  addDialogsWithNewUser,
  getUserChats,
  getUserChatsIds,
  storeChatMessage,
  getChatMessages,
  getUserLastChatMessages
};

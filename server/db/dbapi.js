const mssql = require('mssql');

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: process.env.NODE_ENV === 'development'
  }
};

/**
 * Запрос к бд
 * @param query {string}
 * @returns {Promise<void|Promise>}
 */
async function dbRequest(query) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
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
  return (await dbRequest('SELECT * FROM Users')).recordset;
}

/**
 * Получить всех пользователей с id из массива id'шников
 * @param ids {Array<number>}
 * @returns {Array<UserModel>}
 */
async function getUsersByIds(ids) {
  const inQuery = `${ids.reduce((acc, id, index) => {
    if (index === ids.length - 1) {
      return ` ${id}`;
    }
    return `${id},`;
  }, '')}`;

  return (await dbRequest(`SELECT * FROM Users WHERE id IN (${inQuery})`)).recordset;
}

/**
 * Получить пользователя по условию (атрибут = значение)
 * @param column {String} название атрибута в бд
 * @param value {String | number} значение атрибута
 * @returns {UserModel | boolean}
 */
async function getUser(column, value) {
  const resValue = typeof value === 'string' ? `'${value}'` : value;
  const user = await dbRequest(`SELECT * FROM Users WHERE ${column} = ${resValue}`);
  if (user) return user.recordset[0];
  return false;
}

/**
 * Создать пользователя в бд
 * @param username {String}
 * @param avatarUrl {String}
 * @param githubUrl {String}
 * @returns {UserModel}
 */
async function createAndGetUser(username, avatarUrl, githubUrl) {
  await dbRequest(`INSERT INTO Users(username, avatarUrl, githubUrl)
   VALUES('${username}', '${avatarUrl}', '${githubUrl}')`);
  return getUser('username', username);
}

/**
 * Создать пустой чат
 * @param chatTitle {String}
 * @returns {ChatModel}
 */
async function createAndGetNewChatGroup(chatTitle) {
  return (await dbRequest(`
          INSERT INTO Chats(chatTitle, chatType) VALUES('${chatTitle}', 'Group');

          SELECT * FROM Chats WHERE id=(SELECT SCOPE_IDENTITY());`)
  ).recordset[0];
}

/**
 * Вставить записи чат-собеседник для нового чата
 * @param chatId {number}
 * @param users {Array<UserModel>}
 */
async function addUsersInChat(chatId, users) {
  const insertValues = users.reduce((acc, user, index) => {
    if (index === users.length - 1) {
      return `${acc}(${chatId}, ${user.id})`;
    }
    return `${acc}(${chatId}, ${user.id}),`;
  }, '');

  await dbRequest(`INSERT INTO ChatUsers VALUES ${insertValues}`);
}

/**
 * Добавить диалоги с пользователем, который в первый раз зашел
 * @param username {String}
 */
async function addDialogsWithNewUser(username) {
  await dbRequest(`EXEC AddDialogsWithNewUser @newUserUsername='${username}'`);
}

/**
 * Получить чаты, в которых есть пользователь
 * @param userId
 * @returns {Array<ChatInDbModel>}
 */
async function getUserChats(userId) {
  return (await dbRequest(`SELECT * FROM GetUserChats(${userId})`)).recordset;
}

/**
 * Получить записи вида чат-участник о чатах, в которых есть пользователь с userId
 * @param userId {Number}
 * @returns Array<UserChatModel>
 */
async function getUserChatsChatUserRecords(userId) {
  return (await dbRequest(`SELECT * FROM GetUserChatsChatUserRecords(${userId})`)).recordset;
}

/**
 * Получить id чатов, в которых есть пользователь
 * @param userId
 * @returns {Array<Number>}
 */
async function getUserChatsIds(userId) {
  return (await dbRequest(`SELECT DISTINCT chatId FROM ChatUsers WHERE userId = ${userId}`))
    .recordset.map((obj) => obj.chatId);
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
 * Положить сообщение в бд и получить его с айдишником
 * @param {{chatId: number, senderId: number, text: String, hasAttachments: boolean, status: String, time: Date}}
 * @returns {MessageModel}
 */
async function createAndGetMessage({
  chatId, senderId, text, hasAttachments, status, time
}) {
  return (await dbRequest(`
      INSERT INTO Messages(chatId, senderId, text, hasAttachments, status, time)
      VALUES (${chatId}, ${senderId}, '${text}', ${hasAttachments ? 1 : 0}, '${status}', CAST('${time}' as DATETIME));

      SELECT * FROM MESSAGES WHERE id = (SELECT SCOPE_IDENTITY());
    `)).recordset[0];
}

module.exports = {
  addUsersInChat,
  getUsers,
  getUsersByIds,
  getUser,
  createAndGetUser,
  createAndGetNewChatGroup,
  addDialogsWithNewUser,
  getUserChatsChatUserRecords,
  getUserChats,
  getUserChatsIds,
  createAndGetMessage,
  getChatMessages,
  getUserLastChatMessages
};

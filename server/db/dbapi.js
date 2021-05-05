const mssql = require('mssql');

const CONNECTION_URL = process.env.DATABASE_CONNECTION_STRING;

/**
 * @returns {Array<UserModel> | boolean}
 */
async function getUsers() {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    return (await sql.request().query`SELECT * FROM [User]`).recordset;
  } catch (e) {
    return console.error(e);
  }
}

/**
 * @param username {String}
 * @returns {UserModel | boolean}
 */
async function getUserByName(username) {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    const queryArr = (await sql.request().query`SELECT * FROM [User] WHERE username=${username}`).recordset;
    if (queryArr.length === 0) return false;
    return queryArr[0];
  } catch (e) {
    return console.error(e);
  }
}

/**
 * @param username {String}
 * @param avatarUrl {String}
 * @param githubUrl {String}
 */
async function createUser(username, avatarUrl, githubUrl) {
  try {
    const request = (await mssql.connect(CONNECTION_URL)).request();
    await request
      .query`INSERT INTO [User](username, avatarUrl, githubUrl) VALUES (${username}, ${avatarUrl}, ${githubUrl})`;
  } catch (e) {
    console.error(e);
  }
}

/**
 * @param username {String}
 */
async function addDialogsWithNewUser(username) {
  try {
    const request = (await mssql.connect(CONNECTION_URL)).request();
    await request.query`EXEC AddDialogsWithNewUser @newUserUsername=${username}`;
  } catch (e) {
    console.error(e);
  }
}

/**
 * Получить информацию о чатах пользователя, (если это диалог или чат с собой,
 * то название чата и ава соответсвуют собеседнику
 * @param userId {Number}
 * @returns Array<ChatModel>
 */
async function getUserChats(userId) {
  try {
    const request = (await mssql.connect(CONNECTION_URL)).request();
    return (await request.query`SELECT * FROM GetUserChats(${userId})`).recordset
      .map((rawChat) => ({
        ...rawChat,
        chatTitle: rawChat.chatType === 'Group' ? rawChat.chatTitle : rawChat.sobesednikUsername,
        chatAvatarUrl: rawChat.chatType === 'Group' ? rawChat.chatAvatarUrl : rawChat.sobesednikAvatarUrl,
      }));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Получить следующие ${take} сообщений чата, начиная с ${offset}
 * @param chatId {number}
 * @param offset {number}
 * @param take {number}
 * @returns Array<MessageModel>
 */
async function getChatMessages(chatId, offset, take) {
  try {
    const request = (await mssql.connect(CONNECTION_URL)).request();
    return (await request.query`SELECT * FROM GetChatMessages(${chatId}, ${offset}, ${take})`).recordset;
  } catch (e) {
    console.error(e);
  }
}

/**
 * Положить сообщение в бд
 * TODO найти как из процедуры доставать аут параметр тут и вытаскивать id 1 запросом
 * @returns number
 */
async function storeChatMessage({
  chatId, senderId, text, hasAttachments, status, time
}) {
  try {
    const request = (await mssql.connect(CONNECTION_URL)).request();
    await request.query`EXEC StoreChatMessage
     @chatId=${chatId},
     @senderId=${senderId},
     @text=${text},
     @hasAttachments=${hasAttachments},
     @status=${status},
     @time=${time}
     `;

    return (await request.query`SELECT @@Identity`).recordset[0][''];
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getUsers,
  getUserByName,
  createUser,
  addDialogsWithNewUser,
  getUserChats,
  storeChatMessage,
  getChatMessages
};

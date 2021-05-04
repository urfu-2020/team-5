const mssql = require('mssql');

const User = require('../../client/src/models/user');

const CONNECTION_URL = process.env.DATABASE_CONNECTION_STRING;

/**
 * @returns {Array<User> | boolean}
 */
async function getUsers() {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    return (await sql.request().query`SELECT * FROM [User]`).recordset
      .map(({
        Id, Username, AvatarUrl, GithubUrl
      }) => new User(Id, Username, AvatarUrl, GithubUrl));
  } catch (e) {
    return console.error(e);
  }
}

/**
 * @param username {String}
 * @returns {User | boolean}
 */
async function getUserByName(username) {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    const queryArr = (await sql.request().query`SELECT * FROM [User] WHERE Username=${username}`).recordset;
    if (queryArr.length === 0) return false;
    const {
      Id, Username, AvatarUrl, GithubUrl
    } = queryArr[0];
    return new User(Id, Username, AvatarUrl, GithubUrl);
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
    const sql = await mssql.connect(CONNECTION_URL);
    await sql.request().query`EXEC InsertUser
      @Username=${username},
      @AvatarUrl=${avatarUrl},
      @GithubUrl=${githubUrl}`;
  } catch (e) {
    console.error(e);
  }
}

/**
 * @param username {String}
 */
async function addDialogsWithNewUser(username) {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    await sql.request().query`EXEC AddDialogsWithNewUser @newUserUsername=${username}`;
  } catch (e) {
    console.error(e);
  }
}

/**
 * @param userId {Number}
 * @returns Array<Chat>
 */
async function getUserChats(userId) {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    return (await sql.request().query`SELECT * FROM GetUserChats(${userId})`).recordset
      .map((rawChat) => ({
        ...rawChat,
        ChatTitle: rawChat.ChatType === 'Group' ? rawChat.ChatTitle : rawChat.SobesednikUsername,
        ChatAvatarUrl: rawChat.ChatType === 'Group' ? rawChat.ChatAvatarUrl : rawChat.SobesednikAvatarUrl,
      }));
  } catch (e) {
    console.error(e);
  }
}

/**
 * @param userId {Number}
 * @returns Array<Message>
 */
async function getUserChatsMessages(userId) {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    return (await sql.request().query`SELECT * FROM GetUserChatsMessages(${userId})`).recordset;
  } catch (e) {
    console.error(e);
  }
}

/**
 * @returns number
 */
async function storeChatMessage({
  chatId, senderId, text, hasAttachments, status, time
}) {
  try {
    const request = (await mssql.connect(CONNECTION_URL)).request();
    // найти как из процедуры доставать аут параметр тут и вытаскивать id 1 запросом
    await request.query`EXEC StoreChatMessage
     @ChatId=${chatId},
     @SenderId=${senderId},
     @Text=${text},
     @HasAttachments=${hasAttachments},
     @Status=${status},
     @Time=${time}
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
  getUserChatsMessages,
  storeChatMessage
};

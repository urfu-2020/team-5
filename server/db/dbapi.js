const mssql = require('mssql');

const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');

const CONNECTION_URL = process.env.DATABASE_CONNECTION_STRING;

/**
 * @returns {Array<User> | boolean}
 */
async function getUsers() {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    return (await sql.request().query`SELECT * FROM Users`).recordset
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
    const queryArr = (await sql.request().query`SELECT * FROM Users WHERE Username=${username}`).recordset;
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
    await sql.request().query`exec InsertUser
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
    await sql.request().query`exec AddDialogsWithNewUser @newUserUsername=${username}`;
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
      .map((rawChat) => new Chat(
        rawChat.ChatId,
        rawChat.ChatType,
        rawChat.ChatAvatarUrl,
        rawChat.ChatTitle,
        rawChat.SobesednikId,
        rawChat.SobesednikUsername,
        rawChat.SobesednikAvatarUrl,
        rawChat.SobesednikGHUrl
      ));
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
    return (await sql.request().query`SELECT * FROM GetUserChatsMessages(${userId})`).recordset
      .map((rawMessage) => new Message(
        rawMessage.Id,
        rawMessage.ChatId,
        rawMessage.SenderId,
        rawMessage.Status,
        rawMessage.Text,
        rawMessage.HasAttachments,
        rawMessage.Time
      ));
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
  getUserChatsMessages
};

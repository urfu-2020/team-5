const mssql = require('mssql');

const User = require('../models/user');

const CONNECTION_URL = process.env.DATABASE_CONNECTION_STRING;

/**
 * @returns {Array<User> | boolean}
 */
async function getUsers() {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    const users = (await sql.request().query`SELECT * FROM Users`).recordset
      .map(({
        Id, Username, AvatarUrl, GithubUrl
      }) => new User(Id, Username, AvatarUrl, GithubUrl));
    return users;
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
 * @returns boolean
 */
async function createUser(username, avatarUrl, githubUrl) {
  try {
    const sql = await mssql.connect(CONNECTION_URL);
    await sql.request().query`exec InsertUser
      @Username=${username},
      @AvatarUrl=${avatarUrl},
      @GithubUrl=${githubUrl}`;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

module.exports = {
  getUsers,
  getUserByName,
  createUser
};

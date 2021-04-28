const mssql = require('mssql');

const config = require('./dbconfig');
const User = require('../models/user');

/**
 * @returns {Array<User> | boolean}
 */
async function getUsers() {
  try {
    const sql = await mssql.connect(config);
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
    const sql = await mssql.connect(config);
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
    const sql = await mssql.connect(config);
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

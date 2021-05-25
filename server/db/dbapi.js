const { QueryTypes, Op } = require('sequelize');

const sequelizeConnection = require('./sequelizeConfig');
const User = require('./sequelizeModels/user');
const Chat = require('./sequelizeModels/chat');
const ChatUser = require('./sequelizeModels/chatUser');
const Message = require('./sequelizeModels/message');

/**
 * Получить всех пользователей
 * @returns {Array<UserModel>}
 */
async function getUsers() {
  return User.findAll({ raw: true });
}

/**
 * Получить всех пользователей с id из массива id'шников
 * @param ids {Array<number>}
 * @returns {Array<UserModel>}
 */
async function getUsersByIds(ids) {
  return User.findAll({
    where: {
      id: {
        [Op.in]: ids
      }
    },
    raw: true
  });
}

/**
 * Получить пользователя по условию (атрибут = значение)
 * @param column {String} название атрибута в бд
 * @param value {String | number} значение атрибута
 * @returns {UserModel | boolean}
 */
async function getUser(column, value) {
  return User.findOne({
    where: {
      [column]: value
    },
    raw: true
  });
}

/**
 * Создать пользователя в бд
 * @param username {String}
 * @param avatarUrl {String}
 * @param githubUrl {String}
 * @returns {UserModel}
 */
async function createAndGetUser(username, avatarUrl, githubUrl) {
  const user = await User.create({
    username,
    avatarUrl,
    githubUrl
  });

  return user.dataValues;
}

/**
 * Создать пустой чат
 * @param chatTitle {String}
 * @returns {ChatModel}
 */
async function createAndGetNewChatGroup(chatTitle) {
  const newChatGroup = await Chat.create({
    chatTitle,
    chatType: 'Group'
  }, { fields: ['chatTitle', 'chatType'] });

  return newChatGroup.get({ plain: true });
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

  await sequelizeConnection.query(`INSERT INTO ChatUsers VALUES ${insertValues}`, { type: QueryTypes.INSERT });
}

/**
 * Добавить диалоги с пользователем, который в первый раз зашел
 * @param username {String}
 */
async function addDialogsWithNewUser(username) {
  await sequelizeConnection.query(`EXEC AddDialogsWithNewUser @newUserUsername='${username}'`);
}

/**
 * Получить чаты, в которых есть пользователь
 * @param userId
 * @returns {Array<ChatInDbModel>}
 */
async function getUserChats(userId) {
  return sequelizeConnection.query(`SELECT * FROM GetUserChats(${userId})`, { type: QueryTypes.SELECT });
}

/**
 * Получить записи вида чат-участник о чатах, в которых есть пользователь с userId
 * @param userId {Number}
 * @returns Array<UserChatModel>
 */
async function getUserChatsChatUserRecords(userId) {
  return sequelizeConnection.query(`SELECT * FROM GetUserChatsChatUserRecords(${userId})`, { type: QueryTypes.SELECT });
}

/**
 * Получить id чатов, в которых есть пользователь
 * @param userId
 * @returns {Array<Number>}
 */
async function getUserChatsIds(userId) {
  return (await ChatUser.findAll({
    where: {
      userId
    },
    raw: true
  })).map((obj) => obj.chatId);
}

/**
 * Получить из ${chatId} следующие ${take} сообщений чата, начиная с ${offset}
 * @param chatId {number}
 * @param offset {number}
 * @param take {number}
 * @returns Array<MessageModel>
 */
async function getChatMessages(chatId, offset, take) {
  return Message.findAll({
    where: {
      chatId
    },
    offset,
    limit: take,
    order: [['time', 'DESC']],
    raw: true
  });
}

/**
 * Получить последние сообщения из всех чатов, в которых есть пользователь (для начальных данных о чатах)
 * @param userId {number}
 * @returns Array<MessageModel>
 */
async function getUserLastChatMessages(userId) {
  return sequelizeConnection.query(`SELECT * FROM GetUserLastChatMessages(${userId})`, { type: QueryTypes.SELECT });
}

/**
 * Положить сообщение в бд и получить его с айдишником
 * @param {{chatId: number, senderId: number, text: String, hasAttachments: boolean, status: String, time: Date}}
 * @returns {MessageModel}
 */
async function createAndGetMessage({
  chatId, senderId, text, hasAttachments, status, time
}) {
  const newMessage = await Message.create({
    chatId,
    senderId,
    text,
    hasAttachments,
    status,
    time: sequelizeConnection.cast(time, 'datetime')
  }, { fields: ['chatId', 'senderId', 'text', 'hasAttachments', 'status', 'time'] });

  return newMessage.get({ plain: true });
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

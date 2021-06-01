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
 * Получить всех пользователей
 * @returns {Array<UserModel>}
 */
async function getUsers() {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    return (await request.query('SELECT * FROM Users')).recordset;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить всех пользователей с id из массива id'шников
 * @param ids {Array<number>}
 * @returns {Array<UserModel>}
 */
async function getUsersByIds(ids) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    ids.forEach((id, index) => request.input(`id${index}`, mssql.Int, id));
    const inQuery = ids.map((_, index) => {
      if (index === ids.length - 1) return `@id${index}`;
      return `@id${index},`;
    }).join('');

    return (await request.query(`SELECT * FROM Users WHERE id IN (${inQuery})`)).recordset;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить пользователя по юзернейму
 * @param username {String} значение атрибута
 * @returns {UserModel | boolean}
 */
async function getUserByUsername(username) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('username', mssql.NVarChar(255), username);

    const user = await request.query('SELECT * FROM Users WHERE username = @username');
    if (user) return user.recordset[0];
    return false;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить пользователя по id
 * @param id {number} значение атрибута
 * @returns {UserModel | boolean}
 */
async function getUserById(id) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('id', mssql.Int, id);

    const user = await request.query('SELECT * FROM Users WHERE id = @id');
    if (user) return user.recordset[0];
    return false;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Создать пользователя в бд
 * @param username {String}
 * @param avatarUrl {String}
 * @param githubUrl {String}
 * @returns {UserModel}
 */
async function createAndGetUser(username, avatarUrl, githubUrl) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('username', mssql.NVarChar(255), username);
    request.input('avatarUrl', mssql.NVarChar(512), avatarUrl);
    request.input('githubUrl', mssql.NVarChar(512), githubUrl);

    await request.query(`INSERT INTO Users(username, avatarUrl, githubUrl)
   VALUES(@username, @avatarUrl, @githubUrl)`);
    return getUserByUsername(username);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Создать пустой чат
 * @param chatTitle {String}
 * @param owner {number}
 * @returns {ChatModel}
 */
async function createAndGetNewChatGroup(chatTitle, owner) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('chatTitle', mssql.NVarChar(255), chatTitle);
    request.input('owner', mssql.Int, owner);
    return (await request.query(`
          INSERT INTO Chats(chatTitle, [owner], chatType) VALUES(@chatTitle, @owner, 'Group');

          SELECT * FROM Chats WHERE id=(SELECT SCOPE_IDENTITY());`)
    ).recordset[0];
  } catch (e) {
    console.log(e);
  }
}

/**
 * Вставить записи чат-собеседник для нового чата
 * @param chatId {number}
 * @param users {Array<UserModel>}
 */
async function addUsersInChat(chatId, users) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('chatId', mssql.Int, chatId);
    users.forEach((user, index) => {
      request.input(`user${index}`, mssql.Int, user.id);
    });

    const insertValues = users.reduce((acc, user, index) => {
      if (index === users.length - 1) {
        return `${acc}(@chatId, @user${index})`;
      }
      return `${acc}(@chatId, @user${index}),`;
    }, '');

    await request.query(`INSERT INTO ChatUsers VALUES ${insertValues}`);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Добавить диалоги с пользователем, который в первый раз зашел
 * @param username {String}
 */
async function addDialogsWithNewUser(username) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('username', mssql.NVarChar(255), username);
    await request.query('EXEC AddDialogsWithNewUser @newUserUsername=@username');
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить чаты, в которых есть пользователь
 * @param userId
 * @returns {Array<ChatInDbModel>}
 */
async function getUserChats(userId) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('userId', mssql.Int, userId);
    return (await request.query('SELECT * FROM GetUserChats(@userId)')).recordset;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить записи вида чат-участник о чатах, в которых есть пользователь с userId
 * @param userId {Number}
 * @returns Array<UserChatModel>
 */
async function getUserChatsChatUserRecords(userId) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('userId', mssql.Int, userId);
    return (await request.query('SELECT * FROM GetUserChatsChatUserRecords(@userId)')).recordset;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить id чатов, в которых есть пользователь
 * @param userId
 * @returns {Array<Number>}
 */
async function getUserChatsIds(userId) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('userId', mssql.Int, userId);
    return (await request.query('SELECT DISTINCT chatId FROM ChatUsers WHERE userId = @userId'))
      .recordset.map((obj) => obj.chatId);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить из ${chatId} следующие ${take} сообщений чата, начиная с ${offset}
 * @param chatId {number}
 * @param offset {number}
 * @param take {number}
 * @returns Array<MessageModel>
 */
async function getChatMessages(chatId, offset, take) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('chatId', mssql.Int, chatId);
    request.input('offset', mssql.Int, offset);
    request.input('take', mssql.Int, take);
    return (await request.query('SELECT * FROM GetChatMessages(@chatId, @offset, @take)')).recordset;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить последние сообщения из всех чатов, в которых есть пользователь (для начальных данных о чатах)
 * @param userId {number}
 * @returns Array<MessageModel>
 */
async function getUserLastChatMessages(userId) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('userId', mssql.Int, userId);
    return (await request.query('SELECT * FROM GetUserLastChatMessages(@userId)')).recordset;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Положить сообщение в бд и получить его с айдишником
 * @param {{chatId: number, senderId: number, text: String, hasAttachments: boolean, status: String, time: Date}}
 * @returns {MessageModel}
 */
async function createAndGetMessage({
  chatId, senderId, text, hasAttachments, status, time
}) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('chatId', mssql.INT, chatId);
    request.input('senderId', mssql.INT, senderId);
    request.input('text', mssql.NVarChar(mssql.MAX), text);
    request.input('hasAttachments', mssql.Bit, hasAttachments ? 1 : 0);
    request.input('status', mssql.NVarChar(mssql.MAX), status);
    request.input('time', mssql.VarChar, time);

    return (await request.query(`
      INSERT INTO Messages(chatId, senderId, text, hasAttachments, status, time)
      VALUES
      (@chatId, @senderId, @text, @hasAttachments, @status, CAST(@time as DATETIME));

      SELECT * FROM MESSAGES WHERE id = (SELECT SCOPE_IDENTITY());
    `)).recordset[0];
  } catch (e) {
    console.log(e);
  }
}

/**
 * Создать канал в бд и вернуть его;
 * @param channelTitle {String}
 * @param channelDescription {String}
 * @param owner {number}
 * @returns {ChatInDbModel}
 */
async function createAndGetChannel(channelTitle, channelDescription, owner) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('owner', mssql.INT, owner);
    request.input('channelTitle', mssql.NVarChar(255), channelTitle);
    request.input('channelDescription', mssql.NVarChar(512), channelDescription);
    return (await request.query(`
          INSERT INTO Chats(chatTitle, chatType, [owner], [description])
            VALUES(@channelTitle, 'Channel', @owner, @channelDescription);

          SELECT * FROM Chats WHERE id=(SELECT SCOPE_IDENTITY());
    `)).recordset[0];
  } catch (e) {
    console.log(e);
  }
}

/**
 * Добавить пользователя в чат
 * @param chatId {number}
 * @param userId {number}
 * @returns {Promise<void>}
 */
async function joinToChat(chatId, userId) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('chatId', mssql.INT, chatId);
    request.input('userId', mssql.INT, userId);

    await request.query('INSERT INTO ChatUsers(chatId, userId) VALUES(@chatId, @userId);');
  } catch (e) {
    console.log(e);
  }
}

/**
 * Удалить пользователя из чата
 * @param chatId {number}
 * @param userId {number}
 * @returns {Promise<void>}
 */
async function leaveFromChat(chatId, userId) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('chatId', mssql.INT, chatId);
    request.input('userId', mssql.INT, userId);

    await request.query('DELETE FROM ChatUsers WHERE chatId=@chatId AND userId=@userId');
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить все каналы
 * @param query {String}
 */
async function getAllChannelsByQuery(query) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('query', mssql.NVarChar, query);

    return (await request.query("SELECT * FROM Chats WHERE chatType='Channel' AND chatTitle LIKE @query + '%'"))
      .recordset;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить инфу о чате по ид
 * @param id {number}
 * @returns {ChatInDbModel | boolean}
 */
async function getChatInfo(id) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('id', mssql.Int, id);
    const res = (await request.query('SELECT * FROM Chats WHERE id=@id')).recordset;
    if (res.length === 0) return false;
    return res[0];
  } catch (e) {
    console.log(e);
  }
}

/**
 * Получить участников чата
 * @param chatId {number}
 * @returns Array<UserModel>
 */
async function getChatMembers(chatId) {
  try {
    const request = (await mssql.connect(sqlConfig)).request();
    request.input('chatId', mssql.Int, chatId);
    return (await request.query(`
      SELECT Users.id, Users.username, Users.avatarUrl, Users.githubUrl
      FROM ChatUsers
      JOIN Users
      ON Users.id = ChatUsers.userId
      WHERE ChatUsers.chatId=@chatId
  `)).recordset;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  addUsersInChat,
  getUsers,
  getUsersByIds,
  getUserByUsername,
  getUserById,
  createAndGetUser,
  createAndGetNewChatGroup,
  addDialogsWithNewUser,
  getUserChatsChatUserRecords,
  getUserChats,
  getUserChatsIds,
  createAndGetMessage,
  getChatMessages,
  getUserLastChatMessages,
  createAndGetChannel,
  joinToChat,
  leaveFromChat,
  getAllChannelsByQuery,
  getChatInfo,
  getChatMembers
};

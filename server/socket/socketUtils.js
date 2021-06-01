const {
  getChatMessages, getChatInfo, getChatMembers, getUser, getUsersByIds
} = require('../db/dbapi');

// TODO Сделать так, чтобы при ошибке форма на клиенте не закрывалась

/**
 * По айди чата получить его представление на фронте
 * @param chatId {number}
 * @return {Promise<{owner: *, members: *}>}
 */
const getFrontChatById = async (chatId) => {
  const chat = await getChatInfo(chatId);
  const chatOwner = await getUser('id', chat.owner);
  const chatMembers = await getChatMembers(chatId);
  const lastMessages = await getChatMessages(chatId, 0, 1);

  return {
    ...chat,
    owner: chatOwner,
    lastMessage: lastMessages.length > 0 ? lastMessages[0] : null,
    members: chatMembers
  };
};

/**
 * Валидация нового чата
 * @param chatTitle {String}
 * @param selectedUsers {Array<UserModel>}
 * @return {{error: boolean}|{errorMessage: string, error: boolean}}
 */
async function validateNewChat(chatTitle, selectedUsers) {
  if (chatTitle === '') {
    return { error: true, errorMessage: 'Название чата не может быть пустым.' };
  }
  if (chatTitle.length > 255) {
    return { error: true, errorMessage: 'Максимальная длинна названия чата - 255 символов.' };
  }
  if (selectedUsers.length === 0) {
    return { error: true, errorMessage: 'В группе должен быть хотя бы 1 собеседник.' };
  }

  const ids = selectedUsers.map((user) => user.id);
  const usersFromDb = await getUsersByIds(ids);
  if (usersFromDb.length < ids.length) {
    return {
      error: true,
      errorMessage: 'Одного или нескольких выбранных пользователей не существует'
    };
  }

  return { error: false };
}

async function validateNewChannel(channelTitle, channelDescription) {
  if (channelTitle === '') {
    return { error: true, errorMessage: 'Название канала не может быть пустым.' };
  }
  if (channelTitle.length > 255) {
    return { error: true, errorMessage: 'Максимальная длинна названия канала - 255 символов.' };
  }
  if (channelDescription.length > 512) {
    return { error: true, errorMessage: 'Максимальная длинна описания - 512 символов' };
  }

  return { error: false };
}

function sendError(socket, validateObj) {
  const { errorMessage } = validateObj;
  return socket.send(JSON.stringify({
    type: 'errorMessage',
    payload: { errorMessage }
  }));
}

module.exports = {
  validateNewChat,
  validateNewChannel,
  sendError,
  getFrontChatById
};

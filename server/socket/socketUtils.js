/**
 * Валидация нового чата
 * @param chatTitle {String}
 * @param selectedUsers {Array<UserModel>}
 * @return {{error: boolean}|{errorMessage: string, error: boolean}}
 */
const { getUsersByIds } = require('../db/dbapi');

async function validateNewChat(chatTitle, selectedUsers) {
  if (chatTitle === '') return { error: true, errorMessage: 'Название чата не может быть пустым.' };
  if (selectedUsers.length === 0) return { error: true, errorMessage: 'Название чата не может быть пустым.' };

  const ids = selectedUsers.map((user) => user.id);
  console.log('userIds', ids);

  const usersFromDb = await getUsersByIds(ids);
  console.log('usersFromDb', usersFromDb);

  if (usersFromDb.length < ids) {
    return {
      error: true,
      errorMessage: 'Одного или нескольких выбранных пользователей не существует'
    };
  }

  return { error: false };
}

module.exports = {
  validateNewChat
};

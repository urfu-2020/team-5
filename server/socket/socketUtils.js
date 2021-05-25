/**
 * Валидация нового чата
 * @param chatTitle {String}
 * @param selectedUsers {Array<UserModel>}
 * @return {{error: boolean}|{errorMessage: string, error: boolean}}
 */
const { getUsersByIds } = require('../db/dbapi');

async function validateNewChat(chatTitle, selectedUsers) {
  if (chatTitle === '') return { error: true, errorMessage: 'Название чата не может быть пустым.' };
  console.log(selectedUsers)
  if (selectedUsers.length === 0) return { error: true, errorMessage: 'В группе должен быть хотя бы 1 собеседник.' };

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

module.exports = {
  validateNewChat
};

/**
 * Запись из бд вида чат-собеседник
 */
class UserChatModel {
  /**
   * @param chatId {number}
   * @param userId {number}
   * @param username {String}
   * @param avatarUrl {String}
   * @param githubUrl {String}
   */
  constructor(chatId, userId, username, avatarUrl, githubUrl) {
    this.chatId = chatId;
    this.userId = userId;
    this.username = username;
    this.avatarUrl = avatarUrl;
    this.githubUrl = githubUrl;
  }
}


module.exports = UserChatModel;

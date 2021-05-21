/**
 * Запись из бд вида чат-собеседник
 */
class UserChatModel {
  /**
   * @param chatId {number}
   * @param sobesednikId {number}
   * @param sobesednikUsername {String}
   * @param sobesednikAvatarUrl {String}
   * @param sobesednikGHUrl {String}
   */
  constructor(chatId, sobesednikId, sobesednikUsername, sobesednikAvatarUrl, sobesednikGHUrl) {
    this.chatId = chatId;
    this.sobesednikId = sobesednikId;
    this.sobesednikUsername = sobesednikUsername;
    this.sobesednikAvatarUrl = sobesednikAvatarUrl;
    this.sobesednikGHUrl = sobesednikGHUrl;
  }
}

module.exports = UserChatModel;

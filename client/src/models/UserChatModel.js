
class UserChatModel {
  /** Запись из бд вида чат-собеседник
   * @param chatId {number}
   * @param chatType {('Own'|'Dialog'|'Group')}
   * @param chatAvatarUrl {String}
   * @param chatTitle {String}
   * @param sobesednikId {number}
   * @param sobesednikUsername {String}
   * @param sobesednikAvatarUrl {String}
   * @param sobesednikGHUrl {String}
   */
  constructor(chatId, chatType, chatAvatarUrl,
              chatTitle, sobesednikId, sobesednikUsername, sobesednikAvatarUrl, sobesednikGHUrl) {
    this.chatId = chatId;
    this.chatType = chatType;
    this.chatAvatarUrl = chatAvatarUrl;
    this.chatTitle = chatTitle;
    this.sobesednikId = sobesednikId;
    this.sobesednikUsername = sobesednikUsername;
    this.sobesednikAvatarUrl = sobesednikAvatarUrl;
    this.sobesednikGHUrl = sobesednikGHUrl;
  }
}

module.exports = UserChatModel;

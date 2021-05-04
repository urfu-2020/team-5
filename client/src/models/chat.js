/**
 * Блок диалога в списке чатов
 */
class Chat {
  /**
   * @param ChatId {Number}
   * @param ChatType {('Own'|'Dialog'|'Group')}
   * @param ChatAvatarUrl {String}
   * @param ChatTitle {String}
   * @param SobesednikId {Number}
   * @param SobesednikUsername {String}
   * @param SobesednikAvatarUrl {String}
   * @param SobesednikGHUrl {String}
   */
  constructor(ChatId, ChatType, ChatAvatarUrl,
    ChatTitle, SobesednikId, SobesednikUsername,
    SobesednikAvatarUrl, SobesednikGHUrl) {
    this.ChatId = ChatId;
    this.ChatAvatarUrl = ChatAvatarUrl;
    this.ChatTitle = ChatTitle;
    this.SobesednikId = SobesednikId;
    this.SobesednikUsername = SobesednikUsername;
    this.SobesednikAvatarUrl = SobesednikAvatarUrl;
    this.SobesednikGHUrl = SobesednikGHUrl;
  }
}

module.exports = Chat;

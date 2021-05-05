/**
 * Блок диалога в списке чатов
 */
class ChatModel {
  /**
   * @param chatId {Number}
   * @param chatType {('Own'|'Dialog'|'Group')}
   * @param chatAvatarUrl {String}
   * @param chatTitle {String}
   * @param sobesednikId {Number}
   * @param sobesednikUsername {String}
   * @param sobesednikAvatarUrl {String}
   * @param sobesednikGHUrl {String}
   * @param lastMessage {MessageModel}
   */
  constructor(chatId, chatType, chatAvatarUrl,
    chatTitle, sobesednikId, sobesednikUsername,
    sobesednikAvatarUrl, sobesednikGHUrl, lastMessage) {
    this.chatId = chatId;
    this.chatType = chatType;
    this.chatAvatarUrl = chatAvatarUrl;
    this.chatTitle = chatTitle;
    this.sobesednikId = sobesednikId;
    this.sobesednikUsername = sobesednikUsername;
    this.sobesednikAvatarUrl = sobesednikAvatarUrl;
    this.sobesednikGHUrl = sobesednikGHUrl;
    this.lastMessage = lastMessage;
  }
}

module.exports = ChatModel;

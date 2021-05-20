/**
 * Модель чата на фронте
 */
class ChatModel {
  /**
   * @param chatId {Number}
   * @param chatType {('Own'|'Dialog'|'Group')}
   * @param chatAvatarUrl {String}
   * @param chatTitle {String}
   * @param sobesedniki {Array<UserModel>}
   * @param lastMessage {MessageModel}
   */
  constructor(chatId, chatType, chatAvatarUrl,
              chatTitle, sobesedniki, lastMessage) {
    this.chatId = chatId;
    this.chatType = chatType;
    this.chatAvatarUrl = chatAvatarUrl;
    this.chatTitle = chatTitle;
    this.sobesedniki = sobesedniki;
    this.lastMessage = lastMessage;
  }
}

module.exports = ChatModel;

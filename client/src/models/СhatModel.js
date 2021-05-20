class ChatModel {
  /**
   * модель чата на фронте
   * @param chatId {Number}
   * @param chatType {('Own'|'Dialog'|'Group')}
   * @param chatAvatarUrl {String}
   * @param chatTitle {String}
   * @param sobesedniki {Array<UserModel>}
   * @param messages {Array<MessageModel>}
   */
  constructor(chatId, chatType, chatAvatarUrl,
              chatTitle, sobesedniki, messages) {
    this.chatId = chatId;
    this.chatType = chatType;
    this.chatAvatarUrl = chatAvatarUrl;
    this.chatTitle = chatTitle;
    this.sobesedniki = sobesedniki;
    this.messages = messages;
  }
}

module.exports = ChatModel;

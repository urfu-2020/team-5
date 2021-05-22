/**
 * Модель чата на фронте
 */
class ChatModel {
  /**
   * @param id {Number}
   * @param chatType {('Own'|'Dialog'|'Group')}
   * @param chatAvatarUrl {String}
   * @param chatTitle {String}
   * @param members {Array<UserModel>}
   * @param lastMessage {MessageModel}
   */
  constructor(id, chatType, chatAvatarUrl,
              chatTitle, members, lastMessage) {
    this.id = id;
    this.chatType = chatType;
    this.chatAvatarUrl = chatAvatarUrl;
    this.chatTitle = chatTitle;
    this.members = members;
    this.lastMessage = lastMessage;
  }
}

module.exports = ChatModel;

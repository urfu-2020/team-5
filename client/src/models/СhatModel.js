/**
 * Модель чата на фронте
 */
class ChatModel {
  /**
   * @param id {Number}
   * @param chatType {('Own'|'Dialog'|'Group'|'Channel')}
   * @param description {String}
   * @param owner {UserModel}
   * @param chatAvatarUrl {String}
   * @param chatTitle {String}
   * @param members {Array<UserModel>}
   * @param lastMessage {MessageModel}
   */
  constructor(id, chatType, description, owner, chatAvatarUrl,
              chatTitle, members, lastMessage) {
    this.id = id;
    this.chatType = chatType;
    this.description = description;
    this.owner = owner;
    this.chatAvatarUrl = chatAvatarUrl;
    this.chatTitle = chatTitle;
    this.members = members;
    this.lastMessage = lastMessage;
  }
}

module.exports = ChatModel;

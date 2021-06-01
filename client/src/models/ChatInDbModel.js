/**
 * Модель чата в бд
 */
class ChatInDbModel {
  /**
   * @param id {Number}
   * @param chatType {('Own'|'Dialog'|'Group')}
   * @param owner {number}
   * @param description {String}
   * @param chatAvatarUrl {String}
   * @param chatTitle {String}
   */
  constructor(id, chatType, chatAvatarUrl,
              owner, description, chatTitle) {
    this.id = id;
    this.chatType = chatType;
    this.owner = owner;
    this.description = description;
    this.chatAvatarUrl = chatAvatarUrl;
    this.chatTitle = chatTitle;
  }
}

module.exports = ChatInDbModel;

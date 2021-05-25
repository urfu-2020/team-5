/**
 * Модель чата в бд
 */
class ChatInDbModel {
  /**
   * @param id {Number}
   * @param chatType {('Own'|'Dialog'|'Group')}
   * @param chatAvatarUrl {String}
   * @param chatTitle {String}
   */
  constructor(id, chatType, chatAvatarUrl,
              chatTitle) {
    this.id = id;
    this.chatType = chatType;
    this.chatAvatarUrl = chatAvatarUrl;
    this.chatTitle = chatTitle;
  }
}

module.exports = ChatInDbModel;

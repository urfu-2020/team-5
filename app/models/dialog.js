/**
 * Блок диалога в списке чатов
 */
class Dialog {
  /**
   * @param id {String}
   * @param name {String}
   * @param isOnline {Boolean}
   * @param message {LastMessage}
   * @param countUnreadMessage {Number}
   */
  constructor(id, name, isOnline, message, countUnreadMessage) {
    this.id = id;
    this.name = name;
    this.isOnline = isOnline;
    this.message = message;
    this.countUnreadMessage = countUnreadMessage;
  }
}

module.exports = { Dialog };

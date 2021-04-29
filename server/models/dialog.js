/**
 * Блок диалога в списке чатов
 */
class Dialog {
  /**
   * @param id {Number}
   * @param name {String}
   * @param isOnline {Boolean}
   * @param message {Message}
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

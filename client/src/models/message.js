/**
 * Сообщение
 */
class MessageModel {
  /**
   * @param id {Number}
   * @param chatId {Number}
   * @param senderId {Number}
   * @param text {String}
   * @param hasAttachments {(0 | 1)}
   * @param status {('Read'|'UnRead'|'UnSend')}
   * @param time {String}
   */
  constructor(id, chatId, senderId, text, hasAttachments, status, time) {
    this.id = id;
    this.chatId = chatId;
    this.senderId = senderId;
    this.text = text;
    this.hasAttachments = hasAttachments;
    this.status = status;
    this.time = time;
  }
}

module.exports = MessageModel;

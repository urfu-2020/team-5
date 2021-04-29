/**
 * Сообщение
 */
class Message {
  /**
   * @param id {Number}
   * @param text {String}
   * @param sender {Number}
   * @param time {Date}
   * @param status {MessageType}
   * @param attachments {Attachment}
   */
  constructor(id, text, sender, time, status, attachments) {
    this.id = id;
    this.text = text;
    this.sender = sender;
    this.time = time;
    this.status = status;
    this.attachments = attachments;
  }
}

const MessageType = {
  Read: 'Read',
  Unread: 'UnRead',
  UnSend: 'UnSend'
};

module.exports = { Message, MessageType };

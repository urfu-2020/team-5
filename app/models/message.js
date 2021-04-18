/**
 * Сообщение в чате
 */
class Message {
  /**
   * @param id {String}
   * @param text {String}
   * @param sender {String}
   * @param time {Date}
   * @param status {String} // [Read, Unread, UnSend]
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

module.exports = { Message };

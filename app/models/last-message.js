/**
 * Последние сообщение в диалоге, для отображения его в списке чатов
 */
class LastMessage {
  /**
   * @param text {String}
   * @param sender {String}
   * @param time {Date}
   * @param status {String} // [Read, Unread, UnSend]
   */
  constructor(text, sender, time, status) {
    this.text = text;
    this.sender = sender;
    this.time = time;
    this.status = status;
  }
}

module.exports = { LastMessage };

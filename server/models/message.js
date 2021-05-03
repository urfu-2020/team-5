/**
 * Сообщение
 */
class Message {
  /**
   * @param Id {Number}
   * @param ChatId {Number}
   * @param SenderId {Number}
   * @param Text {String}
   * @param HasAttachments {Bit}
   * @param Status {('Read'|'UnRead'|'UnSend')}
   * @param Time {DateTime}
   */
  constructor(Id, ChatId, SenderId, Text, HasAttachments, Status, Time) {
    this.Id = Id;
    this.ChatId = ChatId;
    this.SenderId = SenderId;
    this.Text = Text;
    this.HasAttachments = HasAttachments;
    this.Status = Status;
    this.Time = Time;
  }
}

module.exports = Message;

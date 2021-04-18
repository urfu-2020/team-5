/**
 * Вложение в сообщение
 */
class Attachment {
  /**
   * @param id {String}
   * @param type {String}
   * @param url {String}
   */
  constructor(id, type, url) {
    this.id = id;
    this.type = type;
    this.url = url;
  }
}

module.exports = { Attachment };

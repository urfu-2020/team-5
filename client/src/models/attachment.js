/**
 * Вложение в сообщение
 */
class AttachmentModel {
  /**
   * @param id {Number}
   * @param type {('Document'|'Movie'|'Music'|'Picture')}
   * @param url {String}
   * @param originalTitle {String}
   */
  constructor(id, type, url, originalTitle) {
    this.id = id;
    this.type = type;
    this.url = url;
    this.originalTitle = originalTitle;
  }
}

module.exports = AttachmentModel;

/**
 * Вложение в сообщение
 */
class Attachment {
  /**
   * @param id {Number}
   * @param type {AttachmentType}
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

const AttachmentType = {
  Document: 'Document',
  Movie: 'Movie',
  Music: 'Music',
  Picture: 'Picture'
};

module.exports = { Attachment, AttachmentType };

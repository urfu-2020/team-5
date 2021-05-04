class UserModel {
  /**
   * @param id {Number}
   * @param username {String}
   * @param avatarUrl {String}
   * @param githubUrl {String}
   */
  constructor(id, username, avatarUrl, githubUrl) {
    this.id = id;
    this.username = username;
    this.avatarUrl = avatarUrl;
    this.githubUrl = githubUrl;
  }
}

module.exports = UserModel;

class User {
  /**
   * @param Id {Number}
   * @param Username {String}
   * @param AvatarUrl {String}
   * @param GithubUrl {String}
   */
  constructor(Id, Username, AvatarUrl, GithubUrl) {
    this.Id = Id;
    this.Username = Username;
    this.AvatarUrl = AvatarUrl;
    this.GithubUrl = GithubUrl;
  }
}

module.exports = User;

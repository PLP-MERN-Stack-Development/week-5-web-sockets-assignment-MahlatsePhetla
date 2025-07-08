
class User {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.online = true;
    this.typing = false;
  }
}

module.exports = User;


class Message {
  constructor({ sender, senderId, message, isPrivate = false }) {
    this.id = Date.now();
    this.sender = sender || 'Anonymous';
    this.senderId = senderId;
    this.message = message;
    this.isPrivate = isPrivate;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = Message;

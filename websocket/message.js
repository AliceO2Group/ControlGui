
module.exports = class Message {

  constructor() {
  }

  create(command, message, broadcast = false, custom = {}) {
    return {command: command, success: 1, broadcast: broadcast, message: message, custom: custom};
  }

  createError(command, errorCode, message) {
    return {command: command, success: 0, status: errorCode, message: message};
  }

}

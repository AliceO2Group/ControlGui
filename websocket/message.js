
module.exports = class Message {

  constructor() {
  }

  create(statusCode, message) {
    return JSON.stringify({success: 1, status: statusCode, message: message});
  }

  createError(errorCode, message) {
    return JSON.stringify({success: 0, status: errorCode, message: message});
  }

}

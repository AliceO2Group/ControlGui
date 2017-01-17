
module.exports = class Message {

  constructor() {
  }

  create(statusCode, message) {
    return {success: 1, status: statusCode, message: message};
  }

  createError(errorCode, message) {
    return {success: 0, status: errorCode, message: message};
  }

}

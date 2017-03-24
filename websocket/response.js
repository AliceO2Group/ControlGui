
module.exports = class Response {

  constructor(code) {
    this._code = code;
    this._broadcast = false;
    this._payload = {};
    this._command = undefined;
  }

  _message(code) {
    const messages = {
      101: 'Switching Protocols',
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      204: 'No content',
      400: 'Bad request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not found',
      440: 'Login timeout'
    };
    return messages[code];
  }

  get getcode() {
    return this._code;
  }

  command(command) {
    this._command = command;
    return this;
  }

  get getcommand() {
    return this._command;
  }

  broadcast() {
    this._broadcast = true;
    return this;
  }

  get getbroadcast() {
    return this._broadcast;
  }

  payload(payload) {
    this._payload = payload;
    return this;
  }

  get getpayload() {
    return this._payload;
  }

  get json() {
    let jsonResponse =  {
      code: this._code, error: (this._code >= 400), broadcast: this._broadcast
    };
    const message = this._message(this._code);
    if (message != undefined) {
      jsonResponse.message = message;
    }
    if (this._command != undefined) {
      jsonResponse.command = this._command;
    }
    if (Object.keys(this._payload).length > 0) {
      jsonResponse.payload = this._payload;
    }
    return jsonResponse;
  }
};

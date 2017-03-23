
/**
 * WebSocket JSON-encoded message factory
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
module.exports = class MessageFactory {

  /**
   * Empty constructor
   * @constructor
   */
  constructor() {
  }

  /**
   * Create JSON message from provided parameters
   * @param {string} command
   * @param {string} message
   * @param {bool} broadcast
   * @param {object} custom - suplementary data
   * @return {object} - JSON message
   */
  create(command, message, broadcast = false, custom = {}) {
    return {command: command, success: 1, broadcast: broadcast, message: message, custom: custom};
  }

  /**
   * Create JSON error message from provided parameters
   * @param {string} command
   * @param {number} errorCode
   * @param {string} message
   * @return {object} - JSON error message
   */
  createError(command, errorCode, message) {
    return {command: command, success: 0, status: errorCode, message: message};
  }
};

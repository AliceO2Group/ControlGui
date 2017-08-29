const log = require('./log.js');
const Response = require('./websocket/response.js');

/**
 * WebSocket module enforcing that only single user is allowed to execute commands at the time.
 * Remaining connected users behave as spectators.
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
class Padlock {
  /**
   * Initialized member variables
   * @constructor
   */
  constructor() {
    this._lockedId = null;
  }

  /**
   * Checks if the user holds the lock
   * @param {string} message - websocket message (with user id)
   * @return {object} response with user id which holds the lock
   */
  check(message) {
    if (this.isHoldingLock(message.id)) {
      return new Response(200).command('lock-get').payload(
        {details: 'Locked by you', locked: true, id: this._lockedId});
    } else if (this._lockedId !== null) {
      return new Response(200).payload(
        {details: 'Locked by ' + this._lockedId, locked: true, id: this._lockedId}
      );
    } else {
      return new Response(200).payload({locked: false});
    }
  }

  /** Provides user with lock if it's not taken already
   * @param {string} message - websocket message (with user id)
   * @return {object} response whether lock was granted or not
   */
  get(message) {
    if (this.lock(message.id)) {
      return new Response(200).payload(
        {details: 'Granted to ' + message.id, id: message.id}
      ).broadcast();
    } else {
      return new Response(403).payload({details: 'Already locked/not authorized'});
    }
  }

  /** Releses the lock if users holds it
   * @param {string} message - websocket message (with user id)
   * @return {object} response whether lock was released successfully
   */
  release(message) {
    if (this.unlock(message.id)) {
      return new Response(200).payload({details: 'Unlocked by ' + message.id}).broadcast();
    } else {
      return new Response(403);
    }
  }

  /**
   * Checks whether user with given id holds the lock.
   * @param {number} id - user id
   * @return {bool} true if user holods the lock, false otherwise
   */
  isHoldingLock(id) {
    return (this._lockedId == id);
  }

  /**
   * Sets the lock ownership to given user.
   * @param {number} id - user id
   * @return {bool} true if succeeds, false otherwise
   */
  lock(id) {
    if (this._lockedId === null) {
      this._lockedId = id;
      log.info('%d : locked', id);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Removes lock  ownership from current holder.
   * @param {number} id - user id
   * @return {bool} true if succeeds, false otherwise
   */
  unlock(id) {
    if (this._lockedId == id) {
      this._lockedId = null;
      log.info('%d : unlocked', id);
      return true;
    }
    return false;
  }
}
module.exports = Padlock;

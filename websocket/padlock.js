const log = require('./../log.js');
const Response = require('./response.js');
/**
 * Manages locking mechanism (only single user can execute commands at the same time
 * The rest can only preview changes
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
module.exports = class Padlock {
  /**
   * Initialized member variables
   */
  constructor() {
    this._lockedId = null;
  }

  /**
   * Processes "lock-*" commands
   * @param {string} command - command name
   * @param {number} id - user id
   * @return {object} - JSON message
   */
  check(command, id) {
    // release lock
    if (command == 'lock-release') {
      if (this.unlock(id)) {
        return new Response(200).payload({details: 'Unlocked by ' + id}).broadcast();
      } else {
        return new Response(403);
      }
    } else if (command == 'lock-get') {
      if (this.lock(id)) {
        return new Response(200).payload({details: 'Granted to ' + id, id: id}).broadcast();
      } else {
        return new Response(403).payload({details: 'Already locked/not authorized'});
      }
    } else if (command == 'lock-check') {
      if (this.isHoldingLock(id)) {
        return new Response(200).command('lock-get').payload({details: 'Locked by you'});
      } else if (this._lockedId !== null) {
        return new Response(200).payload({details: 'Locked by ' + this._lockedId, locked: true, id: this.lockedId});
      } else {
        return new Response(200).payload({locked: false});
      }
    } else {
      return new Response(401);
    }
  }

  isHoldingLock(id) {
    return (this._lockedId == id);
  }

  lock(id) {
    if (this._lockedId === null) {
      this._lockedId = id;
      log.info('%d : locked', id);
      return true;
    } else {
      return false;
    }
  }

  unlock(id) {
    if (this._lockedId == id) {
      this._lockedId = null;
      log.info('%d : unlocked', id);
      return true;
    }
    return false;
  }
};

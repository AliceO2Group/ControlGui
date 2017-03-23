const log = require('./../log.js');

/**
 * Manages locking mechanism (only single user can execute commands at the same time
 * The rest can only preview changes
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
module.exports = class Padlock {
  /**
   * Initialized member variables
   * @param {object} messageFactory
   */
  constructor(messageFactory) {
    this._message = messageFactory;
    this._lockedId = null;
  }

  /**
   * Processes "lock-*" commands
   * @param {string} command - command name
   * @param {number} id - user id
   * @return {object} - JSON message
   */
  process(command, id) {
    if (command == 'lock-release') {
      if (this.unlock(id)) {
        return this._message.create(command, 'Unlocked by ' + id, true);
      } else {
        return this._message.createError(command, 3, 'Not possible to execute command');
      }
    } else {
      return this._message.createError(command, 4, 'Not authorized to execute command');
    }
  }

  privileged(command, id) {
    if (command == 'lock-get') {
      if (this.lock(id)) {
        return this._message.create(command, 'Lock granted to ' + id, true);
      } else {
        return this._message.createError( command, 4, 'Already locked/not authorized to lock');
      }
    } else if (command == 'lock-check') {
      if (this._lockedId !== null) {
        return this._message.create(
          'lock-get', 'Locked by ' + this._lockedId, false, {locked: 1, id: this.lockedId}
        );
      } else {
        return this._message.create('lock-release', 'Not locked', false, {locked: 0});
      }
    } else {
      return this._message.createError(command, 4, 'Not authorized to execute command');
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

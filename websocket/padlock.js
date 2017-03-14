const log = require('./../log.js');

module.exports = class Padlock {

  constructor(messageFactory) {
    this.message = messageFactory;
    this.lockedId = null;
  }
  

  process(command, id) {
    if (command == 'lock-release') {
      return this.unlock(id) ? this.message.create(command,'Unlocked by ' + id, true)
                             : this.message.createError(command, 3, 'Not possible to execute command');
    } else return this.message.createError(command, 4, 'Not authorized to execute command');
  }

  privileged(command, id) {
    if (command == 'lock-get') {
      return this.lock(id) ? this.message.create(command, 'Lock granted to ' + id, true)
                           : this.message.createError(command, 4, 'Already locked/not authorized to lock');
    } else if (command == 'lock-check') {
      return (this.lockedId !== null) ? this.message.create('lock-get', 'Locked by ' + this.lockedId, false, {locked: 1, id: this.lockedId})
                                      : this.message.create('lock-release', 'Not locked', false, {locked: 0});
    }   
    else return this.message.createError(command, 4, 'Not authorized to execute command'); 
  }

  isHoldingLock(id) {
    return (this.lockedId == id);
  }

  lock(id) {
    if (this.lockedId === null) {
      this.lockedId = id;
      log.info('%d : locked', id);
      return true;
    } else {
      return false;
    }   
  }
  
  unlock(id) {
    if (this.lockedId == id) {
      this.lockedId = null;
      log.info('%d : unlocked', id);
      return true;
    }   
    return false;
  }   
};

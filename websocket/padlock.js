module.exports = class Padlock {

  constructor(messageFactory) {
    this.message = messageFactory;
    this.lockedId = null;
  }
  

  process(command, id, authLevel) {
    if (command == 'lock-release') {
      return this.unlock(id, authLevel) ? this.message.create(command,'Unlocked by ' + id, true)
                                        : this.message.createError(command, 3, 'Not possible to execute command');
    } else return this.message.createError(command, 4, 'Not authorized to execute command');
  }

  privileged(command, id, authLevel) {
    if (command == 'lock-get') {
      return this.lock(id, authLevel) ? this.message.create(command, 'Lock granted to ' + id, true)
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

  lock(id, auth) {
    if (this.lockedId == null && auth == 1) {
      this.lockedId = id; 
      return true;
    } else {
      return false;
    }   
  }
  
  unlock(id, auth) {
    if (this.lockedId == id && auth == 1) {
      this.lockedId = null;
      return true;
    }   
    return false;
  }   
}

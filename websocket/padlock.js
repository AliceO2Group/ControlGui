module.exports = class Padlock {

  constructor(messageFactory) {
    this.message = messageFactory;
    this.lockedId = null;
  }
  

  process(command, id, authLevel) {
    if (command == 'release') {
      return this.unlock(id, authLevel) ? this.message.create(0, 'Unlocked by ' + id)
                                        : this.message.createError(3, 'Not possible to execute command');
    } else return this.message.createError(4, 'Not authorized to execute command');
  }

  privileged(command, id, authLevel) {
    if (command == 'get') {
      return this.lock(id, authLevel) ? this.message.create(0, 'Lock granted to ' + id)
                                      : this.message.createError(4, 'Already locked/not authorized to lock');
    } else if (command == 'check') {
      return (this.lockedId !== null) ? this.message.create(1, 'Locked by ' + this.lockedId)
                                      : this.message.create(1, 'Not locked');
    }   
    else return this.message.createError(4, 'Not authorized to execute command'); 
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

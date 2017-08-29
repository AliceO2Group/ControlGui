const assert = require('assert');
const Padlock = require('./../padlock.js');

describe('padlock class', () => {
  const lock = new Padlock();
  const message = {
    alice: {
      id: 1
    },
    bob: {
      id: 2
    }
  };

  it('acquiring lock', () => {
    assert.equal(lock.get(message.alice).getcode, 200, 'Failed to acquire lock');
  });
  it('refuse to lock', () => {
    assert.equal(lock.get(message.bob).getcode, 403, 'Lock granted');
  });
  it('refuse to unlock', () => {
    assert.equal(lock.release(message.bob).getcode, 403, 'Unlocked');
  });
  it('provide lock owner', () => {
    const owner = lock.check(message.bob);
    assert.equal(owner.getcode, 200, 'Failed to check lock owner');
    assert.equal(owner.getpayload.id, message.alice.id, 'Failed to check lock owner');
    assert.equal(lock.check(message.alice).getcode, 200, 'Failed to check lock owner');
  });
  it('unlock', () => {
    assert.equal(lock.release(message.alice).getcode, 200, 'Failed to unlock');
  });
});

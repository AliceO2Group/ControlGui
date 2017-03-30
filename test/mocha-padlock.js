const assert = require('assert');
const Padlock = require('./../websocket/padlock.js');

describe('padlock class', () => {
  const lock = new Padlock();
  const id = {
    alice: 1,
    bob: 2
  };

  it('acquiring lock', () => {
    assert.equal(lock.check('lock-get', id.alice).getcode, 200, 'Failed to acquire lock');
  });
  it('refuse to lock', () => {
    assert.equal(lock.check('lock-get', id.bob).getcode, 403, 'Lock granted');
  });
  it('refuse to unlock', () => {
    assert.equal(lock.check('lock-release', id.bob).getcode, 403, 'Unlocked');
  });
  it('provide lock owner', () => {
    const owner = lock.check('lock-check', id.bob);
    assert.equal(owner.getcode, 200, 'Failed to check lock owner');
    assert.equal(owner.getpayload.id, id.alice, 'Failed to check lock owner');
    assert.equal(lock.check('lock-check', id.alice).getcode, 200, 'Failed to check lock owner');
  });
  it('unlock', () => {
    assert.equal(lock.check('lock-release', id.alice).getcode, 200, 'Failed to unlock');
  });
});

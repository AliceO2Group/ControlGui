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
    assert.equal(lock.get(message.alice).getCode(), 200);
  });
  it('refuse to lock', () => {
    assert.equal(lock.get(message.bob).getCode(), 403);
  });
  it('refuse to unlock', () => {
    assert.equal(lock.release(message.bob).getCode(), 403);
  });
  it('provide lock owner', () => {
    const owner = lock.check(message.bob);
    assert.equal(owner.getCode(), 200);
    assert.equal(owner.getPayload().id, message.alice.id);
    assert.equal(lock.check(message.alice).getCode(), 200);
  });
  it('unlock', () => {
    assert.equal(lock.release(message.alice).getCode(), 200);
  });
});

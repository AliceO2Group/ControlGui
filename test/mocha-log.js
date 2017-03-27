const assert = require('assert');
const fs = require('fs');
const log = require('./../log.js');

describe('error-log', function() {
  it('should generate error file', function() {
    log.error('Test error log entry');
    setTimeout(function() {
      assert.ok(fs.existsSync('./error.log'));
    }, 1000);
  });
});

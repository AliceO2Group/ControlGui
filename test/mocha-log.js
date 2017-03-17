const assert = require('assert'),
          fs = require('fs'),
         log = require('./../log.js');

describe('error-log', function() {
  it('should generate error file', function() {
    log.error('Test error log entry');
    setTimeout(function(){
      assert.ok(fs.existsSync("./error.log"));
    },2000);
  });
});

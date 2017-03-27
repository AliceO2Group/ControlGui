const assert = require('assert');
const express = require('express');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = express();
const config = require('./../config.json');
const fs = require('fs');
const credentials = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
};

const HTTPServer = require('./../http/server');
const http = new HTTPServer(credentials, app);

// as CERN cerfiticates are not signed by any CA
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
chai.use(chaiHttp);

describe('fail-request', () => {
  it('should fail as no token provided', (done) => {
    chai.request(http.httpsServer).get('/api/runs').end((err, res) => {
      assert.equal(res.status, 403, 'Wrong HTTP response code');
      done();
    });
  });
});

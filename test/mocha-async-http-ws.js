const assert = require('assert');
const express = require('express');
const app = express();
const config = require('./../config.json');
const JwtToken = require('./../jwt/token.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const credentials = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
};
const WebSocketClient = require('ws');
const WebSocket = require('./../websocket/server');
const HttpServer = require('./../http/server');

// as CERN cerfiticates are not signed by any CA
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
chai.use(chaiHttp);

const http = new HttpServer(credentials, app);
new WebSocket(http.server);
const jwt = new JwtToken(config.jwt);
const token = jwt.generateToken(0, 'test', 1);

describe('rest-api', () => {
  it('should fail as no token provided', (done) => {
    chai.request(http.httpsServer).get('/api/runs').end((err, res) => {
      assert.equal(res.status, 403, 'Wrong HTTP response code');
      done();
    });
  });

  it('should get response', (done) => {
    chai.request(http.httpsServer)
      .get('/api/runs')
      .query({token: token})
      .end((err, res) => {
        assert.equal(res.status, 200, 'Wrong HTTP response code');
        done();
      });
  });
});

describe('websocket', () => {
  it('should successfully connect to websocket server', (done) => {
    const connection = new WebSocketClient(
     'wss://localhost:' + config.http.portSecure +'/?token=' + token
    );
    connection.on('open', () => {
      setTimeout(() => {
        done();
      }, 250);
    });
    connection.on('close', () => {
      throw new Error('disconnected from ws server');
    });
  });
});

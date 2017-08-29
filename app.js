const express = require('express');
const app = express();
const config = require('./config.json');
const fs = require('fs');
const credentials = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
};

const ZeroMQClient = require('./zeromq/client');
const WebSocket = require('./websocket/server');
const HttpServer = require('./http/server');

const zmqSub = new ZeroMQClient(config.zeromq.sub.ip, config.zeromq.sub.port, 'sub');
const zmqReq = new ZeroMQClient(config.zeromq.req.ip, config.zeromq.req.port, 'req');
const http = new HttpServer(credentials, app);
const websocketServer = new WebSocket(http.server);

const Padlock = require('./padlock.js');
const padlock = new Padlock();
websocketServer.bind('lock-release', (message) => padlock.check(message));
websocketServer.bind('lock-get', (message) => padlock.get(message));
websocketServer.bind('lock-check', (message) => padlock.release(message));
websocketServer.bind('execute', (request) => {
  if (padlock.isHoldingLock(request.id)) {
    zmqReq.send(request);
    return new Response(202);
  } else {
    return new Response(403);
  }
});

zmqSub.on('message', function(message) {
  websocketServer.broadcast(message);
});

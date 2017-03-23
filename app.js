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
const HTTPServer = require('./http/server');

const zmqSub = new ZeroMQClient(config.zeromq.sub.ip, config.zeromq.sub.port, 'sub');
const zmqReq = new ZeroMQClient(config.zeromq.req.ip, config.zeromq.req.port, 'req');
const http = new HTTPServer(credentials, app);
const websocketServer = new WebSocket(http.server);

zmqSub.on('message', function(message) {
  websocketServer.broadcast(message);
});

websocketServer.on('textmessage', function(message) {
  zmqReq.send(message);
});

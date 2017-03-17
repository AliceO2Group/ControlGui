const express = require('express'),
  app = express(),
  config = require('./config.json'),
  fs = require('fs'),
  credentials = {
    key: fs.readFileSync(config.key),
    cert: fs.readFileSync(config.cert)
  },

  ZeroMQClient = require('./zeromq/client'),
  WebSocket = require('./websocket/server'),
  HTTPServer = require('./http/server'),

  zmqSub = new ZeroMQClient(config.zeromq.sub.ip, config.zeromq.sub.port, true),
  zmqReq = new ZeroMQClient(config.zeromq.req.ip, config.zeromq.req.port),
  http = new HTTPServer(credentials, app),
  websocketServer = new WebSocket(http.server);

zmqSub.on('message', function(message) {
  websocketServer.broadcast(message);
});

zmqSub.on('notification', function(notification) {
  websocketServer.broadcast('Notification (' + notification.code + '): ' + notification.message);
});

zmqSub.on('_error', function(error) {
  websocketServer.broadcast('!Error (' + error.code + '): ' + error.message);
});

websocketServer.on('textmessage', function(message) {
  zmqReq.send(message);
});

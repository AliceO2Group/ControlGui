'use strict';

const express = require('express');
const app = express();
const config = require('./config.json');

const fs = require('fs');
const credentials = { 
  key:  fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
};

const ZeroMQClient = require('./zeromq/client');
const WebSocket = require('./websocket/server');
const HTTPServer = require('./http/server');


var zmqSub = new ZeroMQClient(config.zeromq.sub.ip, config.zeromq.sub.port);
var zmqReq = new ZeroMQClient(config.zeromq.req.ip, config.zeromq.req.ip, false);

var http = new HTTPServer(credentials, app);
var websocketServer = new WebSocket(http.server);

zmqSub.on('message', function(message) {
  websocketServer.broadcast(message);
});

zmqSub.on('notification', function(notification) {
  websocketServer.broadcast('Notification (' + notification.code + '): ' + notification.message);
});

zmqSub.on('_error', function(error) {
  websocketServer.broadcast('!Error (' + error.code + '): ' + error.message);
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

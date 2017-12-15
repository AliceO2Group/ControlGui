const config = require('./config.json');

const {ZeroMQClient, HttpServer, WebSocket, WebSocketMessage} = require('@aliceo2/aliceo2-gui');

const zmqSub = new ZeroMQClient(config.zeromq.sub.ip, config.zeromq.sub.port, 'sub');
const zmqReq = new ZeroMQClient(config.zeromq.req.ip, config.zeromq.req.port, 'req');

const http = new HttpServer(config.http, config.jwt, config.oAuth);

const websocketServer = new WebSocket(http, config.jwt);

const Padlock = require('./padlock.js');
const padlock = new Padlock();

websocketServer.bind('lock-release', (message) => padlock.release(message));
websocketServer.bind('lock-get', (message) => padlock.get(message));
websocketServer.bind('lock-check', (message) => padlock.check(message));
websocketServer.bind('execute', (request) => {
  if (padlock.isHoldingLock(request.id)) {
    zmqReq.send(request);
    return new WebSocketMessage(202);
  } else {
    return new WebSocketMessage(403);
  }
});

zmqSub.on('message', function(message) {
  websocketServer.broadcast(message);
});

const config = require('./config.json');

const ZeroMQClient = require('@aliceo2/aliceo2-gui').ZeroMQClient;
const HttpServer = require('@aliceo2/aliceo2-gui').HttpServer;
const WebSocket = require('@aliceo2/aliceo2-gui').WebSocket;
const Notifications = require('@aliceo2/aliceo2-gui').Notifications;

const zmqSub = new ZeroMQClient(config.zeromq.sub.ip, config.zeromq.sub.port, 'sub');
const zmqReq = new ZeroMQClient(config.zeromq.req.ip, config.zeromq.req.port, 'req');

const http = new HttpServer(config.http, config.jwt, config.oAuth);

const websocketServer = new WebSocket(http, config.jwt);
http.passToTemplate('websockethostname', 'pcald03.cern.ch');

const Padlock = require('./padlock.js');
const padlock = new Padlock();

websocketServer.bind('lock-release', (message) => padlock.release(message));
websocketServer.bind('lock-get', (message) => padlock.get(message));
websocketServer.bind('lock-check', (message) => padlock.check(message));
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
// eslint-disable-next-line
const notifications = new Notifications(http, config.pushNotifications);

const EventEmitter = require('events');
const WebSocketServer = require('ws').Server
const url = require('url');
const jwt = require('jsonwebtoken');
const config = require('./../config.json');

module.exports = class WebSocket extends EventEmitter {
   
  constructor(httpsServer) {
    super();
    this.server = new WebSocketServer({ server: httpsServer });
    this.server.on('connection', this.onconnection.bind(this));
  }

  onmessage(message) {
    if (typeof message === 'undefined') {
      return;
    }
    this.emit('textmessage', message);
  }

  onconnection(client) {
    var hostname = client._socket.remoteAddress;
    var token = url.parse(client.upgradeReq.url, true).query.token;
    if (!token) {
      client.close(4001, 'Authentication failed: No token provided.');
    }
    jwt.verify(token, config.jwtSecret, function(err, decoded) {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          client.close(4002, 'Authentication failed: Token expired.');
        } else if (err.name == 'JsonWebTokenError') {
          client.close(4003, 'Authentication failed: Wrong token.'); 
        }
      } else {
          console.log('hurray token verified');
          console.log(decoded);
        }
      });
    client.on('message', this.onmessage.bind(this));
  }

  broadcast(message) {
    this.server.clients.forEach(function(client) {
      client.send(message);
    });
  }
}

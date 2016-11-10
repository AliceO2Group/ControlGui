const EventEmitter = require('events');
const WebSocketServer = require('ws').Server
const url = require('url');
const config = require('./../config.json');

const JwtToken = require('./../jwt/token.js');

module.exports = class WebSocket extends EventEmitter {
   
  constructor(httpsServer) {
    super();
    this.jwt = new JwtToken(config.jwtSecret);
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
    var jwtFeedback = this.jwt.verify(token);
    if (jwtFeedback.success) {
      console.log('hurray token verified!');
      console.log(jwtFeedback.decoded);
    } else {
      client.close(4000, jwtFeedback.message);
    }

    client.on('message', this.onmessage.bind(this));
  }

  broadcast(message) {
    this.server.clients.forEach(function(client) {
      client.send(message);
    });
  }
}

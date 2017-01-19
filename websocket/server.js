const EventEmitter = require('events');
const WebSocketServer = require('ws').Server
const url = require('url');
const config = require('./../config.json');

const JwtToken = require('./../jwt/token.js');
const Padlock = require('./padlock.js');
const MessageFactory = require('./message.js');

module.exports = class WebSocket extends EventEmitter {
   
  constructor(httpsServer) {
    super();
    this.jwt = new JwtToken(config.jwtSecret);
    this.server = new WebSocketServer({ server: httpsServer, clientTracking: true });
    this.server.on('connection', this.onconnection.bind(this));
    this.message = new MessageFactory();
    this.padlock = new Padlock(this.message);
  }

  onmessage(message, address, id, authLevel) {
    if (typeof message === 'undefined') {
      return;
    }
    console.log(message.command, id, authLevel);
    
    if (this.padlock.isHoldingLock(id)) {
      switch(message.command.split('-')[0]) {
        case 'lock':
          return this.padlock.process(message.command, id, authLevel);
          break;
        case 'test':
          this.emit('textmessage', JSON.stringify(message));
          return this.message.create(message.command, 1, 'Command executed');
          break;
        default:
          return this.message.createError(message.command, 404, 'Unknown command');
      }
    } else {
      switch(message.command.split('-')[0]) {
        case 'lock':
          return this.padlock.privileged(message.command, id, authLevel);
          break;
        default: 
          return this.message.createError(message.command, 403, 'Unauthorized');
      }
    }     
  }

  onconnection(client) {
    var token = url.parse(client.upgradeReq.url, true).query.token;
    var jwtFeedback = this.jwt.verify(token);
    if (jwtFeedback.success) {
      client._auth = jwtFeedback.decoded;
    } else {
      client.close(4000, jwtFeedback.message);
    }
    jwtFeedback.decoded.id += Math.floor(Math.random() * 100);
    client.on('message', function(message, flags) {
      var response = this.onmessage(JSON.parse(message), client._socket.remoteAddress, jwtFeedback.decoded.id, jwtFeedback.decoded.access);
      if (response.broadcast) this.broadcast(JSON.stringify(response));
      else client.send(JSON.stringify(response));
    }.bind(this));
  }

  broadcast(message) {
    this.server.clients.forEach(function(client) {
      client.send(message);
    });
  }
}

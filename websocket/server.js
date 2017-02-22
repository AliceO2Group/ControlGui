const EventEmitter = require('events');
const WebSocketServer = require('ws').Server
const url = require('url');
const config = require('./../config.json');
const log = require('./../log.js');

const JwtToken = require('./../jwt/token.js');
const Padlock = require('./padlock.js');
const MessageFactory = require('./message.js');

module.exports = class WebSocket extends EventEmitter {
   
  constructor(httpsServer) {
    super();
    this.jwt = new JwtToken(config.jwtSecret);
    this.server = new WebSocketServer({ server: httpsServer, clientTracking: true });
    this.server.on('connection', this.onconnection.bind(this));
    this.server.on('close', this.onclose.bind(this));
    this.message = new MessageFactory();
    this.padlock = new Padlock(this.message);
  }

  onmessage(message) {
    if (typeof message === 'undefined') {
      return;
    }
    var id = this.verify(message.token);
    if (id === false) return this.message.createError(message.command, 403, 'Unauthorized');
    
    log.debug('%d : command %s', id, message.command);
    
    if ( this.padlock.isHoldingLock(id)) {
      switch(message.command.split('-')[0]) {
        case 'lock':
          return this.padlock.process(message.command, id);
          break;
        case 'test':
          this.emit('textmessage', JSON.stringify(message));
          return this.message.create(message.command, 1, 'Command executed');
          break;
        default:
          return this.message.createError(message.command, 404, 'Unknown command');
      }
    }
    else {
      switch(message.command.split('-')[0]) {
        case 'lock':
          return this.padlock.privileged(message.command, id);
          break;
        default: 
          return this.message.createError(message.command, 403, 'Unauthorized');
      }
    }     
  }

  verify(token) {
    var verified = this.jwt.verify(token);
    if (verified.success && verified.decoded.access == 1) {
      return verified.decoded.id;
    }
    log.warn('unknown : jwt verify failed: %s', verified.message);
    return false;
  }

  onconnection(client) {
    var token = url.parse(client.upgradeReq.url, true).query.token;
    var jwtFeedback = this.jwt.verify(token);
    if (jwtFeedback.success == false) {
      client.close(4000, jwtFeedback.message);
    }
    log.info('%d : connected', jwtFeedback.decoded.id);
    client.on('message', function(message, flags) {
      var response = this.onmessage(JSON.parse(message));
      if (response.broadcast) {
        log.debug('broadcast : command %s sent', response.command);
        this.broadcast(JSON.stringify(response));
      }
      else {
        log.debug('%d : command %s sent', jwtFeedback.decoded.id, response.command);
        client.send(JSON.stringify(response));
      }
    }.bind(this));
  }

  onclose(client) {
    log.info('disconnected');
  }

  broadcast(message) {
    this.server.clients.forEach(function(client) {
      client.send(message);
    });
  }
}

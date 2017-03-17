const EventEmitter = require('events'),
  WebSocketServer = require('ws').Server,
  url = require('url'),
  config = require('./../config.json'),
  log = require('./../log.js'),

  JwtToken = require('./../jwt/token.js'),
  Padlock = require('./padlock.js'),
  MessageFactory = require('./message.js');

module.exports = class WebSocket extends EventEmitter {

  constructor(httpsServer) {
    super();
    this.jwt = new JwtToken(config.jwtSecret);
    this.server = new WebSocketServer({server: httpsServer, clientTracking: true});
    //this.server.on('connection', this.onconnection.bind(this));
    this.server.on('close', this.onclose.bind(this));
    this.message = new MessageFactory();
    this.padlock = new Padlock(this.message);
  }

  onmessage(message) {
    if (typeof message === 'undefined') {
      return;
    }
    const id = this.verify(message.token);
    if (id === false) {
      return this.message.createError(message.command, 403, 'Unauthorized');
    }

    log.debug('%d : command %s', id, message.command);

    if (this.padlock.isHoldingLock(id)) {
      switch(message.command.split('-')[0]) {
        case 'lock':
          return this.padlock.process(message.command, id);
        case 'test':
          this.emit('textmessage', JSON.stringify(message));
          return this.message.create(message.command, 1, 'Command executed');
        default:
          return this.message.createError(message.command, 404, 'Unknown command');
      }
    } else {
      switch(message.command.split('-')[0]) {
        case 'lock':
          return this.padlock.privileged(message.command, id);
        default:
          return this.message.createError(message.command, 403, 'Unauthorized');
      }
    }
  }

  verify(token) {
    const verified = this.jwt.verify(token);
    if (verified.success && verified.decoded.access == 1) {
      return verified.decoded.id;
    }
    log.warn('unknown : jwt verify failed: %s', verified.message);
    return false;
  }

  ononnection(client) {
    const token = url.parse(client.upgradeReq.url, true).query.token;
    const jwtFeedback = this.jwt.verify(token);
    if (jwtFeedback.success === false) {
      client.close(4000, jwtFeedback.message);
    }
    log.info('%d : connected', jwtFeedback.decoded.id);
    client.on('message', function(message, flags) {
      const response = this.onmessage(JSON.parse(message));
      if (response.broadcast) {
        log.debug('broadcast : command %s sent', response.command);
        this.broadcast(JSON.stringify(response));
      } else {
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
};

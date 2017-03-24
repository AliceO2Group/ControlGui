const EventEmitter = require('events');
const WebSocketServer = require('ws').Server;
const url = require('url');
const config = require('./../config.json');
const log = require('./../log.js');

const JwtToken = require('./../jwt/token.js');
const Padlock = require('./padlock.js');
const Response = require('./response.js');

module.exports = class WebSocket extends EventEmitter {

  constructor(httpsServer) {
    super();
    this.jwt = new JwtToken(config.jwt);
    this.server = new WebSocketServer({server: httpsServer, clientTracking: true});
    this.server.on('connection', (client) => this.onconnection(client));
    this.server.on('close', (client) => this.onclose(client));
    this.padlock = new Padlock();
    log.debug('WebSocket server started');
  }

  onmessage(message) {
    if (typeof message === 'undefined') {
      return;
    }
    const responseArray = [];
    let feedback = this.jwtVerify(message.token);
    if (feedback instanceof Response && feedback.getcode != 440) {
      return [feedback];
    } else if (feedback instanceof Response && feedback.getcode == 440) {
      responseArray.push(feedback);
      feedback = this.jwtVerify(feedback.getpayload.newtoken);
    }
    const id = feedback.id;

    log.debug('%d : command %s', id, message.command);

    //if (this.padlock.isHoldingLock(id)) {
      switch(message.command.split('-')[0]) {
        case 'lock':
          responseArray.push(new Response(202));//this.padlock.process(message.command, id);
          break;
        case 'test':
          this.emit('textmessage', JSON.stringify(message));
          responseArray.push(new Response(202));
          break;
        default:
          responseArray.push(new Response(404));
      }
    /*} else {
      switch(message.command.split('-')[0]) {
        case 'lock':
          return this.padlock.privileged(message.command, id);
        default:
          return new Response(403);
      }
    }*/
    return responseArray;
  }

  jwtVerify(token) {
    try {
      return this.jwt.verify(token);
    } catch(err) { 
      log.warn('jwt verify failed: %s', err.message);
      if (err.name == 'TokenExpiredError') {
        const newtoken = this.jwt.refreshToken(token);
        if (newtoken === false) {
          return new Response(403);
        }
        return new Response(440).command('new-token').payload({newtoken: newtoken});
      } else {
        return new Response(401);
      }
    }
  }

  onconnection(client) {
    const token = url.parse(client.upgradeReq.url, true).query.token;
    const feedback = this.jwtVerify(token);
    if (feedback instanceof Response) {
      client.close(1008);
      return;
    }
    const id = feedback.id;
    log.info('%d : connected', id);
    client.on('message', function(message, flags) {
      const parsed = JSON.parse(message);
      const response = this.onmessage(parsed);
      for (let message of response) {
        if (message.getcommand == undefined) {
          message.command(parsed.command);
        }
        if (message.getbroadcast) {
          log.debug('broadcast : command %s sent', message.getcommand);
          this.broadcast(JSON.stringify(message.json));
        } else {
          log.debug('%d : command %s sent', id, message.getcommand);
          client.send(JSON.stringify(message.json));
        }
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

const EventEmitter = require('events');
const WebSocketServer = require('ws').Server;
const url = require('url');
const config = require('./../config.json');
const log = require('./../log.js');
const JwtToken = require('./../jwt/token.js');
const Padlock = require('./padlock.js');
const Response = require('./response.js');

/**
 * The class that represents WebSocket server
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
module.exports = class WebSocket extends EventEmitter {

  /**
   * Starts up the server and binds event handler
   * @param {object} httpsServer - HTTPS server
   * @constructor
   */
  constructor(httpsServer) {
    super();
    this.jwt = new JwtToken(config.jwt);
    this.server = new WebSocketServer({server: httpsServer, clientTracking: true});
    this.server.on('connection', (client) => this.onconnection(client));
    this.server.on('close', (client) => this.onclose(client));
    this.padlock = new Padlock();
    log.debug('WebSocket server started');
  }

  /**
   * Handles incoming text messages: verifies token and processes request/command
   * @param {object} message
   * @return {object} message to be send back to the user
   */
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

    switch(message.command.split('-')[0]) {
      case 'lock':
        responseArray.push(this.padlock.check(message.command, id));
        break;
      case 'test':
        this.emit('textmessage', JSON.stringify(message));
        responseArray.push(new Response(202));
        break;
      case 'execute':
        if (this.padlock.isHoldingLock(id)) {
          this.emit('textmessage', JSON.stringify(message));
          responseArray.push(new Response(202));
        } else {
          responseArray.push(new Response(403));
        }
        break;
      default:
        responseArray.push(new Response(404));
    }
    return responseArray;
  }

  /**
   * Verifies token, if expired request a new one
   * @param {object} token - JWT token
   * @return {object} includes either parsed token or response message
   */
  jwtVerify(token, refresh = true) {
    try {
      return this.jwt.verify(token);
    } catch(err) {
      log.warn('jwt verify failed: %s', err.message);
      if (err.name == 'TokenExpiredError' && refresh) {
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

  /**
   * Handles client connection and message receiving
   * @param {object} client - connected client
   */
  onconnection(client) {
    const token = url.parse(client.upgradeReq.url, true).query.token;
    const feedback = this.jwtVerify(token, false);
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

  /**
   * Handles client disconnection
   * @param {object} client - disconnected client
   */
  onclose(client) {
    log.info('disconnected');
  }

  /**
   * Broadcasts the message to all connected clients
   * @param {string} message
   */
  broadcast(message) {
    this.server.clients.forEach(function(client) {
      client.send(message);
    });
  }
};

const EventEmitter = require('events');
const zmq = require('zmq');
const log = require('./../log.js');

/**
 * ZeroMQ client that connects to O2 Control Master via on of two endpoints: sub or req
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
module.exports = class ZeroMQClient extends EventEmitter {

  /**
   * Creates ZeroMQ socket and binds class methods to basic events
   * @param {string} ip - hostname
   * @param {number} port - port number
   * @param {bool} type - socket type, true = sub. false = req
   * @construct
   */
  constructor(ip, port, type = false) {
    super();

    this.connected = true;
    this.socket = type ? zmq.socket('sub') : zmq.socket('req');

    this.socket.on('connect', (fd, endpoint) => this.connect(endpoint));
    this.socket.on('close', (fd, endpoint) => this.disconnect(endpoint));
    this.socket.on('disconnect', (fd, endpoint) => this.disconnect(endpoint));
    this.socket.monitor(1000, 0);

    this.socket.connect('tcp://' + ip + ':' + port);
    if (type) {
      this.socket.subscribe('');
    }
    this.socket.on('message', (message) => this.onmessage(message));
  }

  /**
   * On-connect event handler
   * @param {string} endpoint
   */
  connect(endpoint) {
    log.debug('ZMQ: Connected to', endpoint);
    this.connected = true;
    this.emit('notification', {
      code: 6000,
      message: 'Connected to ZMQ endpoint: ' + endpoint
    });
  }

  /**
   * On-disconnect event handler
   * @param {string} endpoint
   */
  disconnect(endpoint) {
    if (this.connected) {
      log.debug('ZMQ: Disconnected from', endpoint);
      this.emit('_error', {
        code: 5000,
        message: 'Server disconnected from ZMQ endpoint: ' + endpoint
      });
    }
    this.connected = false;
  }

  /**
   * On-message event handler
   * @param {string} message
   */
  onmessage(message) {
    if (typeof message === 'undefined') {
      return;
    }
    this.emit('message', message.toString());
  }

  /**
   * Sends message via socket
   * @param {string} message
   * @todo disallow sending if the socket is sub type
   */
  send(message) {
    if (!this.connected) {
      this.emit('_error', {
        code: 5000,
        message: 'Connection to ZeroMQ-master in not estabilished. Request discarded'
      });
    }
    this.socket.send(message);
  }
};

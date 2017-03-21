const EventEmitter = require('events'),
  zmq = require('zmq'),
  log = require('./../log.js');

module.exports = class ZeroMQClient extends EventEmitter {

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

  connect(endpoint) {
    log.debug('ZMQ: Connected to', endpoint);
    this.connected = true;
    this.emit('notification', {
      code: 6000,
      message: 'Connected to ZMQ endpoint: ' + endpoint
    });
  }

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

  onmessage(message) {
    if (typeof message === 'undefined') {
      return;
    }
    this.emit('message', message.toString());
  }

  send(message) {
    if (!this.connected) {
      this.emit('_error', {
        code: 5000,
        message: 'Connection to ZeroMQ-master in not estabilished. Request discarded'
      });
      return false;
    }
    this.socket.send(message);
  }
};

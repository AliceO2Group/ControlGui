"use strict";
const EventEmitter = require('events');
const zmq = require('zmq');

module.exports = class ZeroMQClient extends EventEmitter {

  constructor(ip, port, type = true) {
    super();

    this.connected = true;
    this.socket = type ? zmq.socket('sub') : zmq.socket('req');
    
    this.socket.on('connect', this.connect.bind(this));
    this.socket.on('close', this.disconnect.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));
    this.socket.monitor(1000, 0);

    this.socket.connect('tcp://' + ip + ':' + port);
    (type) ? this.socket.subscribe('') : null;

    this.socket.on('message', this.onmessage.bind(this));
  }

  connect(fd, endpoint) {
    console.log('ZMQ: Connected to', endpoint);
    this.connected = true;
    this.emit('notification', {code: 6000, message: 'Connected to ZMQ endpoint: ' + endpoint});
  }

  disconnect(fd, endpoint) {
    if (this.connected) {
      console.log('ZMQ: Disconnected from', endpoint);
      this.emit('_error', { code: 5000, message: 'Server disconnected from ZMQ endpoint: ' + endpoint});
    }
    this.connected = false;
  }
  
  onmessage(topic, message) {
    if (typeof message === 'undefined') {
      return;
    }
    this.emit('message', message.toString());
  }

  send(message) {
    if (!this.connected) {
      this.emit('_error', {code: 5000, message: 'Connection to ZeroMQ-master in not estabilished. Request discarded'});
      return false;
    }
    this.socket.send(message);
  }
}

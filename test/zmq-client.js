// Publisher server for zeromq
const zmq = require('zeromq');
const sock = zmq.socket('pub');
const log = require('./../log.js');

sock.bindSync('tcp://127.0.0.1:3000');

setInterval(function() {
  sendDummy();
}, 7000);


/**
 * Sends dummy notifications to all clients
 * @name sendDummy
 */
function sendDummy() {
  let response = {};
  let i = parseInt(((Math.random()) * 100) % 3);

  let titles = ['Notification', 'Urgent', 'CRASH'];
  let messages = ['The machine\'s speed has been doubled.', 'The machine has been shutted down.',
    'There has been an unexpected shutdown.'];

  response.command = 'notification';
  response.title = titles[i];
  response.message = messages[i];

  log.info('Sending a dummy notification\n', response.title, response.message);
  sock.send(JSON.stringify(response));
}

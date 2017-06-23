// Publisher server for zeromq
let zmq = require('zeromq');
let sock = zmq.socket('pub');

sock.bindSync('tcp://127.0.0.1:3000');
// console.log('Publisher bound to port 3000');

setInterval(function() {
  // console.log('Sending a dummy notification');
  sendDummy();
}, 10000);


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

  sock.send(JSON.stringify(response));
}

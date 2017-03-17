const winston = require('winston');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(
      {timestamp: true, colorize: true, level: 'debug'}
    ),
    new winston.transports.File(
     {filename: './error.log', level: 'error'}
    )
  ],
  exitOnError: true
});

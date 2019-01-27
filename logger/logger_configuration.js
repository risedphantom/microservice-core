const als = require('async-local-storage');
const config = require('config').get('logger');
const DefaultStream = require('./streams/default');
const ConsoleStream = require('./streams/console');


let stream;

switch (config.stream) {
  case 'console':
    stream = new ConsoleStream(als);
    break;
  default:
    stream = new DefaultStream(als);
    break;
}

const reqSerializer = req => ({
  url: req.url,
  method: req.method,
  headers: req.headers,
});

const errSerializer = err => ({
  name: err.name,
  stack: err.stack,
  message: err.constructor.message,
});


module.exports = {
  // Settings
  cron: config.cron,
  useAls: config.useAls,
  // Bunyan options
  env: process.env.ENV || 'local',
  name: config.name,
  type: config.type,
  streams: [{
    type: 'raw',
    level: config.level || 'INFO',
    stream,
  }],
  project: config.project,
  serializers: {
    req: reqSerializer,
    err: errSerializer,
  },
};

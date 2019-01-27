const config = require('config');

const log = require('../logger').log;
const singleton = require('./singleton');

singleton.requests = require('./core/requests');
singleton.storage = require('./storage');
singleton.cache = require('./core/utils/inprocess_cache');

const app = require('./server');


const HOST = config.get('server.address');
const PORT = config.get('server.port');
const SHUT_TIME = config.get('shutdownTimeout');

/*
 * Start
 */
let httpServer;

log.info({methodName: 'root'}, 'Init stores...');
singleton.storage.init()
  .then(() => {
    httpServer = app.listen(PORT, HOST);
    log.info({methodName: 'root'}, `Server is listening at ${PORT}, $ENV = ${process.env.ENV}`);
  })
  .catch((err) => {
    log.fatal({err, methodName: 'root'}, 'Unable to initialize stores!');
    process.exit(1);
  });

/*
 * Stop
 */
process.on('SIGTERM', () => {
  log.info('Received SIGTERM, shutting down gracefully');
  app.enable('closing');

  httpServer.close(() => {
    log.info('Closed out remaining connections');
    process.exit();
  });

  setTimeout(() => {
    log.error('Could not close connections in time, forcing shut down');
    process.exit(1);
  }, SHUT_TIME);
});

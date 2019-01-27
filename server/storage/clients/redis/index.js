const Redis = require('ioredis');
const config = require('config').get('clients.redis');

const log = require('../../../../logger').child({zone: 'redis'});
const codes = require('../../../core/types/error_codes');


function createClient() {
  const redis = config.startupNodes ?
    Redis.Cluster(config.startupNodes, config.options) :
    Redis(config.host, config.port, config.options);
  redis.on('error', err => log.error({err, methodName: 'createClient'}, codes.REDIS_ERROR));

  return redis;
}

module.exports = createClient();

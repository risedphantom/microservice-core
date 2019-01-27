const config = require('config').get('nodeCache');
const NodeCache = require('node-cache');


class NoCache {
  static get() {
    return null;
  }

  static set() {}
  static flushAll() {}

  static keys() {
    return null;
  }

  static del() {
    return null;
  }

  static getStats() {
    return null;
  }
}


module.exports = config.enabled ? new NodeCache(config) : NoCache;

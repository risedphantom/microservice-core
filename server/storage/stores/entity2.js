const log = require('../../../logger').child({className: 'Entity2Store', zone: 'storage'});
const config = require('config').get('stores.entity2');


/**
 * Session manager storage
 */
class Entity2Store {
  /**
   * @param {Object} redis - Redis singleton client
   * @param {Function} redis.get - Redis GET command
   */
  constructor(redis) {
    this._redis = redis;
    this._KEY_ENTITY2 = config.get('keyEntity2');
  }

  /**
   * Get entity by id
   * @param {String} id - Entity ID
   * @return {Promise<null>}
   */
  async get(id) {
    log.debug({methodName: 'get'}, `Redis GET key: ${id}`);

    const res = await this._redis.get(`${this._KEY_ENTITY2}${id}`);

    log.debug({methodName: 'get'}, `Redis response: ${res}`);
    return res;
  }
}


module.exports = Entity2Store;

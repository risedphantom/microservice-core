const config = require('config');
const Promise = require('bluebird');

const redis = require('./clients/redis');
const Mongo = require('./clients/mongo');
const Entity1 = require('./stores/entity1');
const Entity2 = require('./stores/entity2');
const Credentials = require('./stores/credentials');


/**
 * This class joins all existing stores
 */
class Storage {
  constructor() {
    // noinspection JSCheckFunctionSignatures
    this._entity1 = new Entity1(new Mongo(config.get('mongodb')));
    this._entity2 = new Entity2(redis);
    // noinspection JSCheckFunctionSignatures
    this._credentials = new Credentials(new Mongo(config.get('mongodb')));
  }

  /**
   * Init stores
   * @return {Promise<void>}
   */
  async init() {
    await Promise.all([
      this._entity1.init(),
      this._credentials.init(),
    ]);
  }

  /**
   * Getter for Entity1Store store
   * @return {Entity1Store}
   */
  get entity1() {
    return this._entity1;
  }

  /**
   * Getter for Entity2Store store
   * @return {Entity2Store}
   */
  get entity2() {
    return this._entity2;
  }

  /**
   * Getter for CredentialsStore store
   * @return {CredentialsStore}
   */
  get credentials() {
    return this._credentials;
  }
}


module.exports = new Storage();

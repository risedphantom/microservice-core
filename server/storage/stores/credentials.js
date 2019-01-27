const log = require('../../../logger').child({className: 'CredentialsStore', zone: 'storage'});
const config = require('config').get('stores.credentials');
const indexes = require('./indexes/credentials_indexes');
const securedStringify = require('../../../logger').securedStringify;


class CredentialsStore {
  /**
   * @param {MongoConnection} mongo - MongoDB connection
   */
  constructor(mongo) {
    this._db = null;
    this._mongo = mongo;
    this._collection = null;
    this._COLLECTION_NAME = config.get('collectionName');
  }

  /**
   * Create collections and indexes
   * @return {Promise<void>}
   */
  async init() {
    log.info({methodName: 'init'}, 'Create mongodb connection');
    this._db = await this._mongo.connect();
    log.info({methodName: 'init'}, `Create ${this._COLLECTION_NAME} collection and indexes`);
    this._collection = this._db.collection(this._COLLECTION_NAME);
    await this._collection.createIndexes(indexes);
  }

  /**
   * Get user permissions
   * @param {String} login - User login
   * @param {String} hash - Password hash
   * @return {Promise<?{authenticated: String, permissions: String[]}>}
   */
  async getPermissions(login, hash) {
    log.debug({methodName: 'getPermissions'}, `Mongo query: login=${login}`);

    const res = await this._collection.findOne({login, password: hash});

    log.debug({methodName: 'getPermissions'}, `Mongo response: ${securedStringify(res)}`);
    return {
      authenticated: !!res,
      permissions: res && res.permissions,
    };
  }
}


module.exports = CredentialsStore;

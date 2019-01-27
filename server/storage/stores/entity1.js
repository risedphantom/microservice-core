const log = require('../../../logger').child({className: 'Entity1Store', zone: 'storage'});
const config = require('config').get('stores.entity1');
const indexes = require('./indexes/entity1_indexes');
const securedStringify = require('../../../logger').securedStringify;


class Entity1Store {
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
    log.info({methodName: 'init'}, 'Create entity1 collection and indexes');
    this._collection = this._db.collection(this._COLLECTION_NAME);
    await this._collection.createIndexes(indexes);
  }

  /**
   * Get entity1 state
   * @param {String} _id - ID
   * @return {Promise<?String>}
   */
  async getState(_id) {
    log.debug({methodName: 'getState'}, `Mongo query: _id=${_id}`);

    if (!this._mongo.ObjectID.isValid(_id)) {
      return null;
    }
    const res = await this._collection.findOne({_id: this._mongo.ObjectID(_id)});

    log.debug({methodName: 'getState'}, `Mongo response: ${securedStringify(res)}`);
    return res && res.state;
  }
}


module.exports = Entity1Store;

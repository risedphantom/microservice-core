const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

const log = require('../../../../logger').child({className: 'MongoConnection', zone: 'mongo'});

const DEFAULT_OPTIONS = {
  poolSize: 10,
  promiseLibrary: Promise,
  useNewUrlParser: true,
  ignoreUndefined: true,
};


/**
 * Mongo connection
 */
class MongoConnection {
  /**
   * @param {Object} params - Mongo connection string + options
   * @param {String} params.url - Connection string
   * @param {String} params.database - Database name
   * @param {Object} params.options - Additional options
   */
  constructor(params) {
    this.ObjectID = ObjectID;
    this._DB_NAME = params.database;
    this._url = params.url;
    this._options = {...DEFAULT_OPTIONS, ...params.options};
  }

  /**
   * Connect to specific database asynchronously
   * @return {Promise<Object>}
   */
  async connect() {
    try {
      const client = await MongoClient.connect(this._url, this._options);
      return client.db(this._DB_NAME);
    }
    catch (err) {
      log.error({err, methodName: 'createClient'}, 'Mongo connection error!');
      throw err;
    }
  }
}


module.exports = MongoConnection;

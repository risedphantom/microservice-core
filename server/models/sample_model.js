const Promise = require('bluebird');

const log = require('../../logger').child({className: 'SampleModel', zone: 'model'});
const Model = require('./model');
const codes = require('../core/types/error_codes');
const errors = require('../core/utils/errors');
const Sample = require('../core/sample');
const storage = require('../singleton').storage;
const requests = require('../singleton').requests;


class SampleModel extends Model {
  /**
   * Get some test data
   * @return {Promise<void>}
   */
  async getByQueryParams() {
    try {
      const entity1Id = '5c4dedc083b05b295dfa1893';
      const entity2Id = 'sample';

      // Request all sample data
      const [state, entity, todo] = await Promise.all([
        storage.entity1.getState(entity1Id),
        storage.entity2.get(entity2Id),
        requests.jsonPlaceholder.getTodo('1'),
      ]);

      // Set cookies
      this.setCookie('session', entity || Sample.newGUID());

      if (!state) {
        log.error({methodName: 'getByQueryParams', description: `Log some data here. For instance entity1Id: ${entity1Id}`}, codes.BROKEN_DATA);
        throw new errors.SampleModelError(codes.BROKEN_DATA);
      }

      // Set return data
      this.body = todo;
      // Set headers
      this.setHeader('X-State', state);

      log.debug({methodName: 'getByQueryParams'}, `Raw data: ${JSON.stringify(this.body)}`);
    }
    catch (err) {
      // Do some stuff, for instance set some headers (see model_method_call)
      this.setHeader('X-Error', err.message);
      throw err;
    }
  }
}


module.exports = SampleModel;

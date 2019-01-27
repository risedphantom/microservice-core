const _ = require('lodash');
const uuid = require('uuid').v4;
const config = require('config');
const request = require('request-promise');

const log = require('../../../logger').child({zone: 'request'});
const securedStringify = require('../../../logger').securedStringify;


// Global settings
const USER_AGENT = config.get('userAgent');

/**
 * Virtual class for outbound requests
 * @virtual
 */
class Request {
  constructor() {
    this._className = this.constructor.name;
    // Default options
    this._options = {
      json: true,
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
      },
    };
  }

  /**
   * Send request
   * @param {String} methodName - Caller method name
   * @param {Object} options - Request options
   * @return {Promise<void>}
   */
  async send(methodName, options) {
    const meta = log.getLogMeta();
    const requestIdMeta = {
      headers: {
        'x-request-id': (meta && meta.requestId) || uuid(),
      },
    };

    log.debug({methodName, className: this._className}, `--> REQUEST: ${securedStringify(options)}`);
    const response = await request(_.merge(this._options, requestIdMeta, options));
    log.debug({methodName, className: this._className}, `<-- RESPONSE: ${securedStringify(response)}`);

    return response;
  }
}


module.exports = Request;

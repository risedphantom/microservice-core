const config = require('config').get('sources.jsonPlaceholder');

const Request = require('../request');


/**
 * Requests to JSONPlaceholder API
 */
class JSONPlaceholderRequests extends Request {
  constructor() {
    super();
    this.host = config.get('host');

    this._GET_URL = config.get('getUrl');
  }

  /**
   * Get todo by ID
   * @param {String} id - Todo ID
   * @return {Promise<?Object>}
   */
  async getTodo(id) {
    const options = {
      uri: `${this.host}${this._GET_URL.replace('{id}', id)}`,
    };

    return this.send('getTodo', options);
  }
}


module.exports = new JSONPlaceholderRequests();

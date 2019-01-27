const JSONPlaceholder = require('./sources/json_placeholder');


/**
 * This class joins all existing requests
 */
class Requests {
  constructor() {
    this._jsonPlaceholder = JSONPlaceholder;
  }

  /**
   * Getter for JSONPlaceholderRequests object
   * @return {JSONPlaceholderRequests}
   */
  get jsonPlaceholder() {
    return this._jsonPlaceholder;
  }
}


module.exports = new Requests();

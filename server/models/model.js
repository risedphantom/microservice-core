const moment = require('moment');


class Model {
  /**
   * @param {Object} req - Express request object
   */
  constructor(req) {
    this.req = req;
    this._outBody = {};
    this._outHeaders = [];
    this._outCookies = [];
  }

  /**
   * Set response header
   * @param {String} name - Header name
   * @param {?String|Number} value - Header value
   * @return {void}
   */
  setHeader(name, value) {
    this._outHeaders.push({name, value});
  }

  /**
   * Updates cookie with expiration time
   * @param {String} name - Cookie name
   * @param {?String} value - Cookie value
   * @param {Date} [expires] - Cookie
   * @return {void}
   */
  setCookie(name, value, expires = null) {
    this._outCookies.push({
      name,
      value,
      options: {
        expires,
        encode: val => val,
      },
    });
  }

  /**
   * Drop cookie
   * @param {String} name - Cookie name
   * @return {void}
   * @private
   */
  dropCookie(name) {
    this.setCookie(name, '', moment.utc(1).toDate());
  }

  /**
   * Getter for response headers
   * @return {Object[]}
   */
  get headers() {
    return this._outHeaders;
  }

  /**
   * Getter for response cookies
   * @return {Object[]}
   */
  get cookies() {
    return this._outCookies;
  }

  /**
   * Set response body
   * @param {*} value - Body
   */
  set body(value) {
    this._outBody = value;
  }

  /**
   * Getter for response body
   * @return {*}
   */
  get body() {
    return this._outBody;
  }
}


module.exports = Model;

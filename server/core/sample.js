const uuid = require('uuid');


/**
 * @static
 */
class Sample {
  /**
   * Some universal method, that could be used everywhere
   * @return {String}
   */
  static newGUID() {
    return uuid.v4();
  }
}


module.exports = Sample;

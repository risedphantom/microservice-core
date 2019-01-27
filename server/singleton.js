/**
 * This class like global context incapsulates global singleton instances
 */
class Singleton {
  constructor() {
    // This part is only for tests. In root index.js everything is overridden
    this.cache = {
      get: {},
      set: {},
    };
    this.storage = {
      entity1: {},
      entity2: {},
      credentials: {},
    };
    this.requests = {
      jsonPlaceholder: {},
    };
  }
}


module.exports = new Singleton();

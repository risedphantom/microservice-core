class Client {
  /**
   * @param {Object} metrics - Metrics object
   * @param {Object} instance - Storage client
   */
  constructor(metrics, instance) {
    this.metrics = metrics;
    this.client = instance;
  }
}


module.exports = Client;

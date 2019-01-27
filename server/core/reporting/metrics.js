const Prometheus = require('prometheus-client');


class Metrics extends Prometheus {
  constructor(namespace) {
    super();

    this._namespace = namespace;
    this._created = Date.now();

    this.servedRequests = this.newCounter({
      namespace: this._namespace,
      name: 'total_served_requests',
      help: 'Total count of served requests.',
    });

    this.failedRequests = this.newCounter({
      namespace: this._namespace,
      name: 'failed_requests',
      help: 'Total count of failed requests.',
    });

    this.riakRequests = this.newCounter({
      namespace,
      name: 'total_riak_requests',
      help: 'Total count of riak requests.',
    });

    this.failedRiakRequests = this.newCounter({
      namespace,
      name: 'failed_riak_requests',
      help: 'Total count of failed riak requests',
    });
  }

  get uptimeMilliseconds() {
    return Date.now() - this._created;
  }
}


module.exports = new Metrics('payment_service');

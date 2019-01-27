const metrics = require('../core/reporting/metrics');


module.exports = (req, res, next) => {
  metrics.servedRequests.increment();
  req.timeStart = process.hrtime();
  req.metrics = metrics;
  next();
};

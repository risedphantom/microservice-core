const error = require('./error_middleware');
const locale = require('./locale_middleware');
const success = require('./success_middleware');
const metrics = require('./metrics_middleware');
const closing = require('./closing_middleware');
const statics = require('./statics_middleware');
const notFound = require('./not_found_middleware');


module.exports = {
  error,
  locale,
  success,
  metrics,
  closing,
  statics,
  notFound,
};

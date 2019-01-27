const retry = require('async-retry');


module.exports = async fn => retry(fn, {retries: 5});

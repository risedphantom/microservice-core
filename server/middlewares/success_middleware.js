const log = require('../../logger').log;
const utils = require('../core/utils');


module.exports = (req, res, next) => {
  if (!Object.prototype.hasOwnProperty.call(res, 'result')) {
    next();
    return;
  }

  const time = utils.hrtimeToMs(process.hrtime(req.timeStart));
  log.info({methodName: 'success_middleware', elapsed: time}, 'RESPONSE_METRICS');

  if (req.accepts('json')) {
    res.json(res.rawOutput ? res.result : {
      error: null,
      result: res.result,
      meta: {
        time,
      },
    });
    return;
  }

  res.type('txt').send(res.result);
};

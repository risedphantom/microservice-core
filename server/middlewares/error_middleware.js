const log = require('../../logger').log;
const utils = require('../core/utils');
const errors = require('../core/utils/errors');
const metrics = require('../core/reporting/metrics');


// noinspection JSUnusedLocalSymbols
module.exports = (err, req, res, next) => {
  metrics.failedRequests.increment();

  let method = 'warn';
  let status = 500;

  switch (err.constructor) {
    case errors.MovedPermanentlyError:
      status = 301;
      break;
    case errors.BadRequestError:
      status = 400;
      break;
    case errors.UnauthorizedError:
      status = 401;
      break;
    case errors.ForbiddenError:
      status = 403;
      break;
    case errors.NotFoundError:
      status = 404;
      break;
    case errors.MethodNotAllowedError:
      status = 405;
      break;
    case errors.NotAcceptableError:
      status = 406;
      break;
    case errors.RequestTimeoutError:
      status = 408;
      break;
    case errors.UnprocessableEntityError:
      status = 422;
      break;
    case errors.NotImplementedError:
      status = 501;
      break;
    case errors.BadGatewayError:
      status = 502;
      break;
    case errors.ServiceUnavailableError:
      status = 503;
      break;
    case errors.GatewayTimeoutError:
      status = 504;
      break;
    // Custom errors
    case errors.SampleModelError:
      status = 422;
      break;
    // Default error
    default:
      method = 'error';
      break;
  }

  log[method]({err, methodName: 'error_middleware'});

  if (req.accepts('json')) {
    res.status(status).json({
      error: err.message,
      result: null,
      meta: {
        time: utils.hrtimeToMs(process.hrtime(req.timeStart)),
      },
    });
    return;
  }

  res.status(status).type('txt').send(err.message);
};

const Joi = require('joi');

const log = require('../../logger').log;
const codes = require('../core/types/error_codes');
const errors = require('../core/utils/errors');


/**
 * Validate specific schema
 * @param {Object} schema - Schema to validate
 * @return {Function}
 */
module.exports = schema => (req, res, next) => {
  const {error} = Joi.validate(req, schema);
  if (!error) {
    next();
    return;
  }

  let type = codes.INVALID_PARAM;
  if (error.details[0].message.includes('required')) {
    type = codes.PARAM_REQUIRED;
  }
  else if (error.details[0].message.includes('not allowed')) {
    type = codes.PARAM_NOT_ALLOWED;
  }

  log.info({methodName: 'validator_middleware'}, `Validation error: ${error.message}`);
  throw new errors.BadRequestError(`${type}: ${error.details[0].path.join('.').replace(/\.(\d)/g, '[$1]')}`);
};

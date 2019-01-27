const Joi = require('joi');


const setLogLevel = Joi.object({
  body: Joi.string().insensitive().valid([
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
  ]).required(),
}).pattern(/\w+/, Joi.any());


module.exports = {
  setLogLevel,
};

const Joi = require('joi');


const getByQueryParams = Joi.object({
  // Validate here all what you need - query, body, cookie, header
  query: Joi.object({
    id: Joi.string().required(),
  }).required(),
}).pattern(/\w+/, Joi.any());


module.exports = {
  getByQueryParams,
};

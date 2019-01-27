const router = require('express').Router({});

const allow = require('../core/utils/permissions');
const mapper = require('../core/utils/mapper');
const mappers = require('./mappers/sample');
const schemas = require('./schemas/sample');
const validate = require('../middlewares/validator_middleware');
const basicAuth = require('../middlewares/basic_auth_middleware');
const SampleModel = require('../models/sample_model');
const modelMethodCall = require('../core/utils/model_method_call');


/*
 * Methods
 */
/**
 * Get some test data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Promise<void>}
 */
const getByQueryParams = async (req, res, next) => {
  await modelMethodCall(new SampleModel(req), 'getByQueryParams', res);
  next();
};

/*
 * Routes
 * 'basic auth (optional)' -->
 * 'check permissions (optional)' -->
 * 'validate req (optional)' -->
 * 'Invoke method' -->
 * 'Map result (optional)'
 */
router.get('/get-by-query-params', basicAuth, allow('all'), validate(schemas.getByQueryParams), getByQueryParams, mapper(mappers.getByQueryParams));


module.exports = router;

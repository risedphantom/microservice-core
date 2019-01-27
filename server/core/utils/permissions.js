const codes = require('../types/error_codes');
const config = require('config').get('auth');
const errors = require('./errors');


/**
 * Check user permissions
 * Empty - allowed only for administrator
 * 'everyone' - allowed for all authenticated users
 * @return {Function}
 */
module.exports = (...allowed) => (req, res, next) => {
  if (!req.auth) {
    res.header('WWW-Authenticate', 'Basic');
    throw new errors.UnauthorizedError(codes.NO_AUTH);
  }

  allowed.push(...config.get('adminRoles'));
  const allowedCI = allowed.join('|').toLowerCase().split('|');
  if (!req.auth.permissions.some(p => allowedCI.includes(p.toLowerCase()))) {
    throw new errors.ForbiddenError(codes.INVALID_PERMISSIONS);
  }

  next();
};

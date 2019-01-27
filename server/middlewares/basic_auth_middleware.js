const auth = require('basic-auth');
const crypto = require('crypto');

const codes = require('../core/types/error_codes');
const config = require('config').get('auth');
const errors = require('../core/utils/errors');
const storage = require('../singleton').storage;


/**
 * Authorize user using cookies or simple credentials
 * @param {Object} req - Express request object
 * @param {Object} req.auth - Auth result (output)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Promise<void>}
 */
module.exports = async (req, res, next) => {
  const cred = auth(req);
  if (!cred) {
    res.header('WWW-Authenticate', 'Basic');
    throw new errors.UnauthorizedError(codes.NO_AUTH);
  }

  const sha256 = crypto.createHash('sha256').update(cred.pass).digest('hex');
  const {authenticated, permissions} = await storage.credentials.getPermissions(cred.name, sha256);

  if (!authenticated) {
    res.header('WWW-Authenticate', 'Basic');
    throw new errors.UnauthorizedError(codes.WRONG_AUTH);
  }

  req.auth = {
    user: cred.name,
    password: sha256,
    permissions: [...permissions, ...config.get('guestRoles')],
  };
  next();
};

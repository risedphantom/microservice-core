const codes = require('../core/types/error_codes');
const errors = require('../core/utils/errors');


module.exports = () => {
  // noinspection JSCheckFunctionSignatures
  throw new errors.NotFoundError(codes.NOT_FOUND);
};

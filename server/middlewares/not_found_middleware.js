const errors = require('../core/utils/errors');


module.exports = () => {
  // noinspection JSCheckFunctionSignatures
  throw new errors.NotFoundError('NOT FOUND');
};

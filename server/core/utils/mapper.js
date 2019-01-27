/**
 * Transform output result
 * @param {Function} mapper - Mapper function
 * @param {Boolean} rawOutput - Indicates whether to add meta to output or not
 * @return {Function}
 */
module.exports = (mapper, rawOutput = false) => (req, res, next) => {
  res.result = mapper(res.result);
  res.rawOutput = rawOutput;
  next();
};

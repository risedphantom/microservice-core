/**
 * Execute model method and write results to res
 * @param {Model} model - Instance of Model class
 * @param {String} method - Method to execute
 * @param {Object} res - Express response object
 * @return {Promise<void>}
 */
module.exports = async (model, method, res) => {
  try {
    await model[method]();
    res.result = model.body;
  }
  finally {
    model.headers.forEach(header => res.header(header.name, header.value));
    model.cookies.forEach(cookie => res.cookie(cookie.name, cookie.value, cookie.options));
  }
};

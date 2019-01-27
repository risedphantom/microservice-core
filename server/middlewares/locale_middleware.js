module.exports = (req, res, next) => {
  req.locale = req.cookies.accept_language;
  next();
};

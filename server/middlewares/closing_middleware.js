module.exports = (req, res, next) => {
  if (!req.app.enabled('closing')) {
    next();
    return;
  }

  res.set('Connection', 'close');
  res.status(503).end('Server is shutting down');
};

module.exports = (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
};
module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: err.message
    }
  });

  console.error(err);
};
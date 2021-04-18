module.exports = (error, req, res, next) => {
  const status = error.status || 500;
  let json = {
    status_code: status,
    message: error.message,
  }

  if (status === 422) {
    json['error'] = error.error
  }

  res.status(status).json(json);
};
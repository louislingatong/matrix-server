const User = require('../models/User');
const Error = require('../helpers/errorHelper');

module.exports = async (req, res, next) => {
  const {username, email} = req.body;
  const rgx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let isEmail = true;

  if (username) {
    isEmail = rgx.test(username);
  }

  if (isEmail) {
    const isNotVerifiedEmail = await User.exists({$or: [{email}, {'email': username}], status: 'PENDING'});
    if (isNotVerifiedEmail) {
      next(Error.badRequest('Email is not verified'));
      return;
    }
  }
  next();
};
const User = require('../models/User');
const { parseError } = require('../helpers/errorHelper');

module.exports = async (req, res, next) => {
  const {username, email} = req.body;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let isEmail = true;

  if (username) {
    isEmail = re.test(username);
  }

  if (isEmail) {
    const isNotVerifiedEmail = await User.exists({$or:[ {email}, {'email': username} ], status: 'PENDING'});
    if (isNotVerifiedEmail) {
      return parseError(res, 400, 'Email is not verified');
    }
  }
  next();
};
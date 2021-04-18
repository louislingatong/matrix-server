const userService = require('../services/userService');

const index = async (req, res, next) => {
  const list = await userService.retrieveUsersByGroupAndLeader(req.user.group, req.user);
  res.status(200).json({list});
};

const retrieveById = async (req, res, next) => {
  const data = await userService.retrieveUserById(req.params['userId'])
  res.status(200).json({data});
}

module.exports = {
  index,
  retrieveById
}
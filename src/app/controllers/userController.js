const User = require('../models/User');

module.exports = {
  index: async (req, res, next) => {
    let users = await User
      .find({
        group: req.user.group, leader: req.user
      })
      .populate('profile', 'firstName lastName')
      .select('level code name email');
    res.status(200).json({ list: users });
  },

  getUser: async (req, res, next) => {
    const user = await User
      .findOne({
        group: req.user.group,
        _id: req.params.userId
      })
      .populate('profile', 'firstName lastName')
      .select('level code name username email');
    res.status(200).json({ data: user });
  },
}
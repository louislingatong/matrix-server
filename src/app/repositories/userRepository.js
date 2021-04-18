const User = require('../models/User');

const createUser = async (data, leader, session) => {
  try {
    const user = new User(data);
    await user.save({session});
    if (leader) {
      await user.updateOne({
        leader,
        level: leader.level + 1
      }).session(session)
      await leader.updateOne({
        $push: {
          members: user
        }
      }).session(session);
    }
    return user;
  } catch (e) {
    throw e;
  }
};

const retrieveUsers = async (filter, session) => {
  try {
    const users = await User
      .find(filter)
      .select('code group level name username email status')
      .populate({
        path: 'members leader',
        select: 'level code name email',
        populate: {
          path: 'members',
          select: 'level code name email'
        }
      })
      .session(session);
    return users;
  } catch (e) {
    throw e;
  }
};

const retrieveUser = async (filter, session) => {
  try {
    const user = await User
      .findOne(filter)
      .select('code group level name username email status')
      .session(session);
    return user;
  } catch (e) {
    throw e;
  }
};

const countUsers = async (filter, session) => {
  try {
    const count = await User
      .countDocuments(filter)
      .session(session);
    return count;
  } catch (e) {
    throw e;
  }
};

const checkUserExist = async (filter, session) => {
  try {
    const isExist = await User
      .exists(filter, session);
    return isExist;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  createUser,
  retrieveUsers,
  retrieveUser,
  countUsers,
  checkUserExist
}
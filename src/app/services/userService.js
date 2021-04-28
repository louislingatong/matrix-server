const userRepository = require('../repositories/userRepository');

const createUser = async (data, leader, session) => {
  try {
    return await userRepository.createUser(data, leader, session);
  } catch (e) {
    throw e;
  }
};

const retrieveUsers = async () => {
  try {
    return await userRepository.retrieveUsers({role: 'USER'});
  } catch (e) {
    throw e;
  }
};

const retrieveUsersByGroupAndLeader = async (group, leader, session) => {
  try {
    return await userRepository.retrieveUsers({group, leader}, session);
  } catch (e) {
    throw e;
  }
};

const retrieveUserById = async (_id, session) => {
  try {
    return await userRepository.retrieveUser({_id}, session);
  } catch (e) {
    throw e;
  }
};

const retrieveUser = async (filter, session) => {
  try {
    return await userRepository.retrieveUser(filter, session);
  } catch (e) {
    throw e;
  }
};

const countUsers = async (filter, session) => {
  try {
    return await userRepository.countUsers(filter, session);
  } catch (e) {
    throw e;
  }
};

const checkUserExist = async (filter, session) => {
  try {
    return await userRepository.checkUserExist(filter, session);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createUser,
  retrieveUsers,
  retrieveUsersByGroupAndLeader,
  retrieveUserById,
  retrieveUser,
  countUsers,
  checkUserExist
}
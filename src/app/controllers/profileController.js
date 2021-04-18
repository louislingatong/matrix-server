const {startSession} = require('mongoose');

const profileService = require('../services/profileService');

const retrieve = async (req, res, next) => {
  const user = req.user;
  const profile = await profileService.retrieveProfileByUser(user);
  res.status(200).json(profile);
};

const update = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const profile = await profileService.updateProfileByUser(req.user, req.body, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json(profile);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const updateAvatar = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const avatar = await profileService.updateProfileAvatarByUser(req.user, req.file, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json(avatar);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
}

module.exports = {
  retrieve,
  update,
  updateAvatar
}
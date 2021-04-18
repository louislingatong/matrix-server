const fs = require('fs');

const profileRepository = require('../repositories/profileRepository');
const imageService = require('./imageService');
const userService = require('./userService');
const Error = require('../helpers/errorHelper');

const createProfile = async (data, session) => {
  try {
    return await profileRepository.createProfile(data, session);
  } catch (e) {
    throw e;
  }
};

const retrieveProfileByUser = async (user, session) => {
  try {
    return await profileRepository.retrieveProfile({user}, session);
  } catch (e) {
    throw e;
  }
};

const updateProfileByUser = async (user, data, session) => {
  try {
    const userExist = await userService.retrieveUser({
      username: data.username,
      _id: {
        $ne: user.id
      }
    }, session);

    if (userExist) {
      Error.unprocessableEntity({username: 'Username is already exist.'})
    }

    await user.updateOne({
      username: data.username
    }).session(session)

    const profile = await profileRepository.retrieveUpdateProfile(
        {user},
        {
          firstName: data.firstName,
          lastName: data.lastName
        },
        session
      );

    return profile;
  } catch (e) {
    throw e;
  }
};

const updateProfileAvatarByUser = async (user, file, session) => {
  try {
    const {filename, path} = file;

    const avatar = await imageService.createImage({
      filename,
      path
    }, session);

    const profile = await profileRepository.retrieveProfile({user}, session);

    const image = profile['avatar'];
    if (image) {
      await fs.unlinkSync(image.path);
      await image.remove();
    }

    await profile.updateOne({avatar}).session(session);

    return avatar;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createProfile,
  retrieveProfileByUser,
  updateProfileByUser,
  updateProfileAvatarByUser
}
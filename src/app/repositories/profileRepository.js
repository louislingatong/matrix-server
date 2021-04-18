const Profile = require('../models/Profile');

const createProfile = async (data, session) => {
  try {
    const profile = new Profile(data);
    await profile.save({session});
    return profile;
  } catch (e) {
    throw e;
  }
};

const retrieveProfile = async (filter, session) => {
  try {
    const profile = await Profile
      .findOne(filter)
      .select('firstName lastName')
      .session(session);
    return profile;
  } catch (e) {
    throw e;
  }
};

const retrieveUpdateProfile = async (filter, data, session) => {
  try {
    const profile = await Profile
      .findOneAndUpdate(
        filter,
        data,
        {new: true, session}
      );
    return profile;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createProfile,
  retrieveProfile,
  retrieveUpdateProfile
}
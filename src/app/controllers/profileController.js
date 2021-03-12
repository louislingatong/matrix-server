const fs = require('fs');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Image = require('../models/Image');
const { parseError } = require('../helpers/errorHelper');

const createImage = async (data) => {
  const image = new Image(data);
  await image.save();
  const {_id, filename, path} = image;
  return {_id, filename, path};
};

const deleteImage = async (data) => {
  await fs.unlinkSync(data.path);
  await data.remove();
};

module.exports = {
  view: async (req, res, next) => {
    const user = req.user;
    const profile = await Profile
      .findOne({ user })
      .populate('avatar', 'filename path')
      .populate('user', 'status code name username email');

    res.status(200).json(profile);
  },

  update: async (req, res, next) => {
    const user = req.user;

    const usernameExist = await User.exists({username: req.body.username, _id: { $ne: user.id }});
    if (usernameExist) {
      return parseError(res, 422, { username: 'Username is already exist.' });
    }

    await user.updateOne({
      username: req.body.username
    })

    const profile = await Profile
      .findOneAndUpdate({ user }, {
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }, {new: true})
      .populate('avatar', 'filename path')
      .populate('user', 'name username email');

    res.status(200).json(profile);
  },

  updateAvatar: async (req, res, next) => {
    const { filename, path } = req.file;
    const user = req.user;
    const avatar = await createImage({
      owner: user,
      filename,
      path
    });

    const profile = await Profile
      .findOne({ user })
      .populate('avatar', 'path');

    const image = profile.avatar;
    if (image) {
      await deleteImage(image);
    }

    await profile.updateOne({ avatar });

    res.status(200).json(avatar);
  }
}
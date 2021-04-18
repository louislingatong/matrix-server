const mongoose = require('mongoose');

const autoPopulateRelationships = function (next) {
  try {
    this
      .populate({
        path: 'user avatar',
        select: 'code group level name username email status role filename path'
      });
    next();
  } catch (err) {
    next(err);
  }
};

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  avatar: {
    type: Schema.Types.ObjectId,
    ref: 'image'
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

profileSchema
  .pre('findOne', autoPopulateRelationships)
  .pre('findOneAndUpdate', autoPopulateRelationships);

const Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;
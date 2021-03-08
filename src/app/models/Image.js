const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

module.exports = mongoose.model('image', imageSchema);
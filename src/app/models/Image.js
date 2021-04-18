const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
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

const Image = mongoose.model('image', imageSchema);

module.exports = Image;
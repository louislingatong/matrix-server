const mongoose = require('mongoose');
const { app } = require('../../../config');

const Schema = mongoose.Schema;

const calculateExpirationTime = function (next) {
  try {
    const currentTime = new Date().getTime();
    this.expireAt =  new Date(currentTime + (app.ticketExpirationMinutes * 60000));
    next();
  } catch (err) {
    next(err);
  }
};

const ticketSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

ticketSchema
  .pre('save', calculateExpirationTime);

module.exports = mongoose.model('ticket', ticketSchema);
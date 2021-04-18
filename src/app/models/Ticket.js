const mongoose = require('mongoose');
const randomstring = require('randomstring');
const {app} = require('../../../config');

const autoGenerateTokenAndExpirationTime = async function (next) {
  try {
    let token;
    let isUniqueToken =  true;
    const currentTime = new Date().getTime();

    while (isUniqueToken) {
      token = await randomstring.generate();
      isUniqueToken = await Ticket.exists({token});
    }

    this.token = token;
    this.expireAt = new Date(currentTime + (app.ticketExpirationMinutes * 60000));
    next();
  } catch (err) {
    next(err);
  }
};

const autoPopulateRelationships = function (next) {
  try {
    this.populate({
      path: 'owner',
      select: 'name',
    });
    next();
  } catch (err) {
    next(err);
  }
};

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  token: String,
  expireAt: Date
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

ticketSchema
  .pre('save', autoGenerateTokenAndExpirationTime)
  .pre('findOne', autoPopulateRelationships);

const Ticket = mongoose.model('ticket', ticketSchema);

module.exports = Ticket;
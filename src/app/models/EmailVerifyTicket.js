const mongoose = require('mongoose');
const randomstring = require('randomstring');
const {app} = require('../../../config');

const autoGenerateCodeAndExpirationTime = async function (next) {
  try {
    let code;
    let isUniqueCode =  true;

    while (isUniqueCode) {
      code = await randomstring.generate(6);
      isUniqueCode = await EmailVerifyTicket.exists({code});
    }

    const currentTime = new Date().getTime();
    const expireAt = new Date(currentTime + (app.ticketExpirationMinutes * 60000));

    this.set({
      code,
      expireAt
    });
    next();
  } catch (err) {
    next(err);
  }
};

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  code: String,
  email: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  expireAt: Date
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

ticketSchema
  .pre('findOneAndUpdate', autoGenerateCodeAndExpirationTime)

const EmailVerifyTicket = mongoose.model('emailVerifyTicket', ticketSchema);

module.exports = EmailVerifyTicket;
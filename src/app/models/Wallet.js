const mongoose = require('mongoose');

const autoPopulateTransactions = function (next) {
  try {
    this.populate({
      path: 'owner transactions',
      select: 'name type amount message createdAt'
    });
    next();
  } catch (err) {
    next(err);
  }
};

const Schema = mongoose.Schema;

const walletSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    required: true
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: 'walletTransaction'
  }]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

walletSchema
  .pre('findOne', autoPopulateTransactions);

const Wallet = mongoose.model('wallet', walletSchema);

module.exports = Wallet;
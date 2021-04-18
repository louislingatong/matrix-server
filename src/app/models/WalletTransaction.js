const mongoose = require('mongoose');
const {wallet} = require('../../../config');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  type: {
    type: String,
    enum: wallet.transactionTypes,
    required: true
  },
  amount: {
    type: Number,
    default: 0,
    required: true
  },
  message: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const WalletTransaction = mongoose.model('walletTransaction', transactionSchema);

module.exports = WalletTransaction;
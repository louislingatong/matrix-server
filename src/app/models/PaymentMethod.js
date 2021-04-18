const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentMethodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  receiverPhoneNumber: {
    type: String,
    required: true,
  },
  receiverAddress: {
    type: String,
    required: true,
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const PaymentMethod = mongoose.model('paymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
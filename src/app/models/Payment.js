const mongoose = require('mongoose');

const autoPopulateRelationships = function (next) {
  try {
    this
      .populate({
        path: 'receipt',
        select: 'filename path'
      });
    next();
  } catch (err) {
    next(err);
  }
};

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  amount: {
    type: Number,
    default: 0,
    required: true
  },
  ctrlRefNumber: {
    type: String,
    required: true
  },
  receipt: {
    type: Schema.Types.ObjectId,
    ref: 'image',
    required: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

paymentSchema
  .pre('findOne', autoPopulateRelationships);

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;
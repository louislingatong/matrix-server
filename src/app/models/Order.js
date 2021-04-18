const mongoose = require('mongoose');

const {order} = require('../../../config');

const autoPopulateRelationships = function (next) {
  try {
    this
      .populate({
        path: 'deliveryAddress paymentMethod items payment',
        select: 'firstName lastName address province city postalCode barangay country email phoneNumber name quantity refModel amount ctrlRefNumber',
        populate: {
          path: 'item receipt',
          select: 'name memberPrice filename path',
          populate: {
            path: 'owner product',
            select: 'name price'
          }
        },
      });
    next();
  } catch (err) {
    next(err);
  }
};

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  shopperCode: String,
  orderNumber: String,
  deliveryAddress: {
    type: Schema.Types.ObjectId,
    ref: 'deliveryAddress',
    required: true
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: 'paymentMethod',
    required: true
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'orderItem',
    required: true
  }],
  totalAmount: {
    type: Number,
    default: 0,
    required: true
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'payment'
  },
  status: {
    type: String,
    enum: order.statuses,
    default: 'PENDING',
    required: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

orderSchema
  .pre('findOne', autoPopulateRelationships)
  .pre('findOneAndUpdate', autoPopulateRelationships);

const Order = mongoose.model('order', orderSchema);

module.exports = Order;
const mongoose = require('mongoose');
const {order} = require('../../../config');

const autoPopulateRelationships = function (next) {
  try {
    this
      .populate({
        path: 'item',
        select: 'name memberPrice',
        populate: {
          path: 'owner product',
          select: 'name price'
        }
      });
    next();
  } catch (err) {
    next(err);
  }
};

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    refPath: 'refModel',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  refModel: {
    type: String,
    required: true,
    enum: ['product', 'sellerProduct']
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

orderItemSchema
  .pre('findOne', autoPopulateRelationships);

const OrderItem = mongoose.model('orderItem', orderItemSchema);

module.exports = OrderItem;
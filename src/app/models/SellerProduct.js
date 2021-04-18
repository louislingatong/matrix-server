const mongoose = require('mongoose');

const autoPopulateRelationships = function (next) {
  try {
    this
      .populate({
        path: 'owner product',
        select: 'name price'
      });
    next();
  } catch (err) {
    next(err);
  }
};

const Schema = mongoose.Schema;

const sellerProductSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  quantity: {
    type: Number,
    default: 0,
    required: true
  },
  sold: {
    type: Number,
    default: 0,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

sellerProductSchema
  .pre('findOne', autoPopulateRelationships);

const SellerProduct = mongoose.model('sellerProduct', sellerProductSchema);

module.exports = SellerProduct;
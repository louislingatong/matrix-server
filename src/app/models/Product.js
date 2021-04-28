const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  memberPrice: {
    type: Number,
    required: true
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'image'
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const Product = mongoose.model('product', productSchema);

module.exports = Product;
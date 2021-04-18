const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deliveryAddressSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  barangay: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const DeliveryAddress = mongoose.model('deliveryAddress', deliveryAddressSchema);

module.exports = DeliveryAddress;
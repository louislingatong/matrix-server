const DeliveryAddress = require('../models/DeliveryAddress');

const createDeliveryAddress = async (data, session) => {
  try {
    const deliveryAddress = new DeliveryAddress(data);
    await deliveryAddress.save({session});
    return deliveryAddress;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createDeliveryAddress
};
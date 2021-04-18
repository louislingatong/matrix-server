const deliveryAddressRepository = require('../repositories/deliveryAddressRepository');

const createDeliveryAddress = async (data, session) => {
  try {
    return await deliveryAddressRepository.createDeliveryAddress(data, session);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createDeliveryAddress
}
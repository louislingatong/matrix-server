const paymentMethodRepository = require('../repositories/paymentMethodRepository');

const retrievePaymentMethods = async () => {
  try {
    return await paymentMethodRepository.retrievePaymentMethods();
  } catch (e) {
    throw e;
  }
};

const retrievePaymentMethod = async (filter, session) => {
  try {
    return paymentMethodRepository.retrievePaymentMethod(filter, session);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  retrievePaymentMethods,
  retrievePaymentMethod
}
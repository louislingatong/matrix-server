const PaymentMethod = require('../models/PaymentMethod');

const retrievePaymentMethods = async (filter, session) => {
  try {
    const paymentMethods = await PaymentMethod
      .find(filter)
      .select('name receiverName receiverPhoneNumber receiverAddress')
      .session(session);
    return paymentMethods;
  } catch (e) {
    throw e;
  }
};

const retrievePaymentMethod = async (filter, session) => {
  try {
    const paymentMethods = await PaymentMethod
      .findOne(filter)
      .select('name receiverName receiverPhoneNumber receiverAddress')
      .session(session);
    return paymentMethods;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  retrievePaymentMethods,
  retrievePaymentMethod
}
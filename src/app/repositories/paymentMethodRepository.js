const PaymentMethod = require('../models/PaymentMethod');

const createPaymentMethod = async (data, session) => {
  try {
    const paymentMethod = new PaymentMethod(data);
    await paymentMethod.save({session});
    return paymentMethod;
  } catch (e) {
    throw e;
  }
};

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
    const paymentMethod = await PaymentMethod
      .findOne(filter)
      .select('name receiverName receiverPhoneNumber receiverAddress')
      .session(session);
    return paymentMethod;
  } catch (e) {
    throw e;
  }
};

const updatePaymentMethod = async (filter, data, session) => {
  try {
    const paymentMethod = await PaymentMethod
      .findOneAndUpdate(
        filter,
        data,
        {new: true, session})
      .select('name receiverName receiverPhoneNumber receiverAddress');
    return paymentMethod;
  } catch (e) {
    throw e;
  }
};

const deletePaymentMethod = async (filter, session) => {
  try {
    const result = await PaymentMethod
      .findOneAndDelete(filter)
      .session(session);
    return result;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createPaymentMethod,
  retrievePaymentMethods,
  retrievePaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
}
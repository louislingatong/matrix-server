const Payment = require('../models/Payment');

const createPayment = async (data, session) => {
  try {
    const payment = new Payment(data);
    await payment.save({session});
    return payment;
  } catch (e) {
    throw e;
  }
};

const retrievePayment = async (filter, session) => {
  try {
    const payment = await Payment
      .findOne(filter)
      .select('amount ctrlRefNumber')
      .session(session)
    return payment;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createPayment,
  retrievePayment
};
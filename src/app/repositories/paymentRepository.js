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

module.exports = {
  createPayment
};
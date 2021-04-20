const paymentRepository = require('../repositories/paymentRepository');

const createPayment = async (data, session) => {
  try {
    return await paymentRepository.createPayment(data, session);
  } catch (e) {
    throw e;
  }
};

const retrieveDownloadPaymentById = async (_id, session) => {
  try {
    const payment = await paymentRepository.retrievePayment({_id}, session);
    const name = payment.receipt.filename;
    const path = `storage/receipt/${name}`;
    return {
      name,
      path
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createPayment,
  retrieveDownloadPaymentById
}
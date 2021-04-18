const paymentRepository = require('../repositories/paymentRepository');

const createPayment = async (data, session) => {
  try {
    return await paymentRepository.createPayment(data, session);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createPayment
}
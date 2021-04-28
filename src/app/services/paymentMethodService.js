const paymentMethodRepository = require('../repositories/paymentMethodRepository');

const createPaymentMethod = async (data, session) => {
  try {
    return await paymentMethodRepository.createPaymentMethod(data, session);
  } catch (e) {
    throw e;
  }
};

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

const retrievePaymentMethodById = async (_id, session) => {
  try {
    return await paymentMethodRepository.retrievePaymentMethod({_id}, session);
  } catch (e) {
    throw e;
  }
};

const updatePaymentMethodById = async (_id, data, session) => {
  try {
    return await paymentMethodRepository.updatePaymentMethod({_id}, data, session);
  } catch (e) {
    throw e;
  }
};

const deletePaymentMethodById = async (_id, session) => {
  try {
    return await paymentMethodRepository.deletePaymentMethod({_id}, session);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createPaymentMethod,
  retrievePaymentMethods,
  retrievePaymentMethod,
  retrievePaymentMethodById,
  updatePaymentMethodById,
  deletePaymentMethodById
}
const {startSession} = require('mongoose');

const paymentMethodService = require('../services/paymentMethodService');

const index = async (req, res, next) => {
  const list = await paymentMethodService.retrievePaymentMethods();
  res.status(200).json({list});
};

const create = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const data = await paymentMethodService.createPaymentMethod(req.body, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({data});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const retrieveById = async (req, res, next) => {
  const data = await paymentMethodService.retrievePaymentMethodById(req.params['paymentMethodId']);
  res.status(200).json({data});
};

const updateById = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const data = await paymentMethodService.updatePaymentMethodById(req.params['paymentMethodId'], req.body, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({data});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const deleteById = async (req, res, next) => {
  await paymentMethodService.deletePaymentMethodById(req.params['paymentMethodId']);
  res.status(200).json({message: 'Product has been deleted successfully'});
};

module.exports = {
  index,
  create,
  retrieveById,
  updateById,
  deleteById
}
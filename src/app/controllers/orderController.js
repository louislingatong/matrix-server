const {startSession} = require('mongoose');

const orderService = require('../services/orderService');

const create = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    req.body['code'] = req.user && req.user.code
    const {orderNumber, orderList} = await orderService.createOrder(req.body, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({orderNumber, orderList});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const createOrderPayment = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const list = await orderService.createOrderPaymentByOrderNumber(req.params['orderNumber'], req.body, req.file, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({list});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const index = async (req, res, next) => {
  const list = await orderService.retrieveOrders();
  res.status(200).json({list});
};

const retrieveById = async (req, res, next) => {
  const data = await orderService.retrieveOrderById(req.params['orderId']);
  res.status(200).json({data});
};

const retrieveByOrderNumber = async (req, res, next) => {
  const list = await orderService.retrieveOrders({orderNumber: req.params['orderNumber']});
  res.status(200).json({list});
};

const updateStatusByOrderNumber = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const status = await orderService.updateOrderStatusByOrderNumber(req.params['orderNumber'], req.body, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({status});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const checkEmailStatus = async (req, res, next) => {
  const isVerified = await orderService.checkEmailStatus(req.query);
  res.status(200).json({isVerified});
};

const sendVerifyEmailCode = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    await orderService.sendVerifyEmailCode(req.body, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({message: 'Email verification link has been sent to your email'});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const verifyEmail = async (req, res, next) => {
  const isVerified = await orderService.verifyEmail(req.body);
  res.status(200).json({isVerified});
};

module.exports = {
  index,
  retrieveById,
  create,
  updateStatusByOrderNumber,
  retrieveByOrderNumber,
  createOrderPayment,
  sendVerifyEmailCode,
  checkEmailStatus,
  verifyEmail
}
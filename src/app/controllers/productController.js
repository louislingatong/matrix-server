const {startSession} = require('mongoose');

const productService = require('../services/productService');

const index = async (req, res, next) => {
  const list = await productService.retrieveProducts();
  res.status(200).json({list});
};

const create = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const data = await productService.createProduct(req.body, session);
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
  const data = await productService.retrieveProductById(req.params['productId']);
  res.status(200).json({data});
};

const updateById = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const data = await productService.updateProductById(req.params['productId'], req.body, session);
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
  await productService.deleteProductById(req.params['productId']);
  res.status(200).json({message: 'Product has been deleted successfully'});
};

const updateImageById = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const image = await productService.updateProductImageById(req.params['productId'], req.file, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json(image);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

module.exports = {
  create,
  index,
  retrieveById,
  updateById,
  deleteById,
  updateImageById
}
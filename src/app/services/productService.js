const productRepository = require('../repositories/productRepository');

const createProduct = async (data, session) => {
  try {
    return await productRepository.createProduct(data, session);
  } catch (e) {
    throw e;
  }
};

const retrieveProducts = async () => {
  try {
    return await productRepository.retrieveProducts();
  } catch (e) {
    throw e;
  }
};

const retrieveProduct = async (filter, session) => {
  try {
    return await productRepository.retrieveProduct(filter, session);
  } catch (e) {
    throw e;
  }
};

const retrieveProductById = async (_id, session) => {
  try {
    return await productRepository.retrieveProduct({_id}, session);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createProduct,
  retrieveProducts,
  retrieveProduct,
  retrieveProductById
}
const Product = require('../models/Product');

const createProduct = async (data, session) => {
  try {
    const product = new Product(data);
    await product.save({session});
    return product;
  } catch (e) {
    throw e;
  }
};

const retrieveProducts = async (filter, session) => {
  try {
    const products = await Product
      .find(filter)
      .select('name memberPrice')
      .session(session);
    return products;
  } catch (e) {
    throw e;
  }
};

const retrieveProduct = async (filter, session) => {
  try {
    const product = await Product
      .findOne(filter)
      .select('name memberPrice')
      .session(session)
    return product;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createProduct,
  retrieveProducts,
  retrieveProduct
}
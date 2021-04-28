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
      .select('name description price memberPrice')
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
      .select('name description price memberPrice')
      .session(session);
    return product;
  } catch (e) {
    throw e;
  }
};

const updateProduct = async (filter, data, session) => {
  try {
    const product = await Product
      .findOneAndUpdate(
        filter,
        data,
        {new: true, session})
      .select('name description memberPrice');
    return product;
  } catch (e) {
    throw e;
  }
};

const deleteProduct = async (filter, session) => {
  try {
    const result = await Product
      .findOneAndDelete(filter)
      .session(session);
    return result;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createProduct,
  retrieveProducts,
  retrieveProduct,
  updateProduct,
  deleteProduct
}
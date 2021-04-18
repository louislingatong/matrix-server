const SellerProduct = require('../models/SellerProduct');

const createSellerProduct = async (data, session) => {
  try {
    const product = new SellerProduct(data);
    await product.save({session});
    return product;
  } catch (e) {
    throw e;
  }
};

const retrieveSellerProducts = async (filter, session) => {
  try {
    const products = await SellerProduct
      .find(filter)
      .select('quantity sold')
      .populate({
        path: 'owner product',
        select: 'name price'
      })
      .session(session);
    return products;
  } catch (e) {
    throw e;
  }
};

const retrieveSellerProduct = async (filter, session) => {
  try {
    const product = await SellerProduct
      .findOne(filter)
      .select('quantity sold')
      .session(session);
    return product;
  } catch (e) {
    throw e;
  }
};

const retrieveUpdateSellerProduct = async (filter, data, session) => {
  try {
    const product = await SellerProduct
      .findOneAndUpdate(
        filter,
        data,
        {new: true, session}
      )
      .select('quantity sold');
    return product;
  } catch (e) {
    throw e;
  }
};

const aggregateSellerProducts = async (pipeline) => {
  try {
    const sellerProducts = await SellerProduct.aggregate(pipeline);
    return sellerProducts;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  createSellerProduct,
  retrieveSellerProducts,
  retrieveSellerProduct,
  retrieveUpdateSellerProduct,
  aggregateSellerProducts
};
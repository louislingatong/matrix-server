const productService = require('../services/productService');

const index = async (req, res, next) => {
  const list = await productService.retrieveProducts();
  res.status(200).json({list});
};

const retrieveById = async (req, res, next) => {
  const data = await productService.retrieveProductById(req.params['productId']);
  res.status(200).json({data});
};

module.exports = {
  index,
  retrieveById
}
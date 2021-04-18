const sellerProductService = require('../services/sellerProductService');

const index = async (req, res, next) => {
  const list = await sellerProductService.retrieveSellerProductsByParams(req.query);
  res.status(200).json({list});
};

const retrieveById = async (req, res, next) => {
  const data = await sellerProductService.retrieveSellerProductById(req.params['productId']);
  res.status(200).json({data});
};

const retrieveOwners = async (req, res, next) => {
  const list = await sellerProductService.retrieveUniqueOwners();
  res.status(200).json({list});
};

const retrieveProducts = async (req, res, next) => {
  const list = await sellerProductService.retrieveUniqueProducts();
  res.status(200).json({list});
};

module.exports = {
  index,
  retrieveById,
  retrieveOwners,
  retrieveProducts
}
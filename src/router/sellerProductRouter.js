const express = require('express');
const router = require('express-promise-router')();
const SellerProductController = require('../app/controllers/sellerProductController');
const {validateParam, validateBody, schemas} = require('../app/middlewares/routeValidationMiddleware');

router.route('/')
  .get(validateBody(schemas.retrieveAllSellerProductSchema), SellerProductController.index);

router.route('/owners')
  .get(SellerProductController.retrieveOwners);

router.route('/products')
  .get(SellerProductController.retrieveProducts);

router.route('/:productId')
  .get(validateParam(schemas.idSchema, 'productId'), SellerProductController.retrieveById);

module.exports = router;
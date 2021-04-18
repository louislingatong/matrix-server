const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const ProductController = require('../app/controllers/productController');
const {validateParam, schemas} = require('../app/middlewares/routeValidationMiddleware');

const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/')
  .get(passportJWT, ProductController.index);

router.route('/:productId')
  .get(passportJWT, validateParam(schemas.idSchema, 'productId'), ProductController.retrieveById);

module.exports = router;
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const PaymentMethodController = require('../app/controllers/paymentMethodController');
const {validateParam, validateBody, schemas} = require('../app/middlewares/routeValidationMiddleware');

const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/')
  .get(PaymentMethodController.index)
  .post(passportJWT, validateBody(schemas.createPaymentMethodSchema), PaymentMethodController.create);

router.route('/:paymentMethodId')
  .get(passportJWT, validateParam(schemas.idSchema, 'paymentMethodId'), PaymentMethodController.retrieveById)
  .put(passportJWT, validateParam(schemas.idSchema, 'paymentMethodId'), validateBody(schemas.updatePaymentMethodSchema), PaymentMethodController.updateById)
  .delete(passportJWT, validateParam(schemas.idSchema, 'paymentMethodId'), PaymentMethodController.deleteById);

module.exports = router;
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const paymentController = require('../app/controllers/paymentController');
const {validateParam, schemas} = require('../app/middlewares/routeValidationMiddleware');

const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/:paymentId/download')
  .get(validateParam(schemas.idSchema, 'paymentId'), paymentController.downloadById);

module.exports = router;
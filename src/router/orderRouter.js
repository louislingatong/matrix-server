const express = require('express');
const router = require('express-promise-router')();
const multer = require('multer');
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const OrderController = require('../app/controllers/orderController');
const {validateBody, schemas} = require('../app/middlewares/routeValidationMiddleware');
const {upload} = require('../app/middlewares/fileUploadMiddleware');

const passportJWT = passport.authenticate('jwt', {session: false});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage/receipt/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

router.route('/')
  .get(passportJWT, OrderController.index);

router.route('/check-email-status')
  .get(validateBody(schemas.checkEmailSchema), OrderController.checkEmailStatus);

router.route('/verify-email')
  .put(validateBody(schemas.verifyEmailSchema), OrderController.verifyEmail)
  .post(validateBody(schemas.issueEmailVerificationCodeSchema), OrderController.sendVerifyEmailCode);

router.route('/place-order')
  .post(passportJWT, validateBody(schemas.createOrderSchema), OrderController.create);

router.route('/place-order/guest')
  .post(validateBody(schemas.createOrderSchema), OrderController.create);

router.route('/payment-download/:paymentId')
  .post(validateBody(schemas.createOrderSchema), OrderController.create);

router.route('/:orderNumber')
  .get(OrderController.retrieveByOrderNumber)
  .put(passportJWT, validateBody(schemas.updateOrderStatusSchema), OrderController.updateStatusByOrderNumber)
  .post(upload({storage}).single('receipt'), validateBody(schemas.completeOrderPaymentSchema), OrderController.createOrderPayment);

module.exports = router;
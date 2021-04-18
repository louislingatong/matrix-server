const express = require('express');
const router = require('express-promise-router')();
const PaymentMethodController = require('../app/controllers/paymentMethodController');

router.route('/')
  .get(PaymentMethodController.index);

module.exports = router;
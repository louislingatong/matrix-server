const express = require('express');
const router = express.Router()
const authRouter = require('./authRouter');
const profileRouter = require('./profileRouter');
const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter');
const walletRouter = require('./walletRouter');
const productRouter = require('./productRouter');
const sellerProductRouter = require('./sellerProductRouter');
const paymentMethodRouter = require('./paymentMethodRouter');
const paymentRouter = require('./paymentRouter');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/users', userRouter);
router.use('/orders', orderRouter);
router.use('/wallet', walletRouter);
router.use('/products', productRouter);
router.use('/seller-products', sellerProductRouter);
router.use('/payment-methods', paymentMethodRouter);
router.use('/payments', paymentRouter);

module.exports = router;
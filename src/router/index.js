const express = require('express');
const router = express.Router()
const authRouter = require('./authRouter');
const profileRouter = require('./profileRouter');
const userRouter = require('./userRouter');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/users', userRouter);

module.exports = router;
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const WalletController = require('../app/controllers/walletController');

const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/')
  .get(passportJWT, WalletController.retrieve);

module.exports = router;
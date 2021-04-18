const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const AuthController = require('../app/controllers/authController');
const {validateBody, schemas} = require('../app/middlewares/routeValidationMiddleware');

const passportLogin = passport.authenticate('local', {session: false});

router.route('/register')
  .post(validateBody(schemas.registerSchema), AuthController.register);

router.route('/login')
  .post(passportLogin, validateBody(schemas.loginSchema), AuthController.login);

router.route('/forgot-password')
  .post(validateBody(schemas.forgotPasswordSchema), AuthController.forgotPassword);

router.route('/reset-password')
  .post(validateBody(schemas.resetPasswordSchema), AuthController.resetPassword);

router.route('/resend-verify-email-link')
  .post(validateBody(schemas.issueEmailVerificationLinkSchema), AuthController.resendVerifyEmailLink);

router.route('/verify-email/:token')
  .post(AuthController.verifyEmail);

module.exports = router;

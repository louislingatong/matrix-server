const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const verifyEmail = require('../app/middlewares/verifyEmailMiddleware');
const AuthController = require('../app/controllers/authController');
const { validateBody, schemas } = require('../app/helpers/routeHelper');

const passportLogin = passport.authenticate('local', { session: false });

router.route('/register')
  .post(validateBody(schemas.registerSchema), AuthController.register);

router.route('/login')
  .post(validateBody(schemas.loginSchema), verifyEmail, passportLogin, AuthController.login);

router.route('/forgot-password')
  .post(validateBody(schemas.forgotPasswordSchema), verifyEmail, AuthController.forgotPassword);

router.route('/reset-password')
  .post(validateBody(schemas.resetPasswordSchema), AuthController.resetPassword);

router.route('/verify-email/:token')
  .post(AuthController.verifyEmail);

router.route('/resend-verify-email-link')
  .post(validateBody(schemas.issueEmailVerificationLinkSchema), AuthController.resendVerifyEmailLink);

module.exports = router;

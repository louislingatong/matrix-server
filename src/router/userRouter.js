const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const UserController = require('../app/controllers/userController');
const { validateParam, schemas } = require('../app/helpers/routeHelper');

const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/')
  .get(passportJWT, UserController.index);

router.route('/:userId')
  .get(passportJWT, validateParam(schemas.idSchema, 'userId'), UserController.getUser);

module.exports = router;
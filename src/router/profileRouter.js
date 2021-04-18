const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const ProfileController = require('../app/controllers/profileController');
const {validateBody, schemas} = require('../app/middlewares/routeValidationMiddleware');
const {upload} = require('../app/middlewares/fileUploadMiddleware');

const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/')
  .get(passportJWT, ProfileController.retrieve)
  .put(passportJWT, validateBody(schemas.updateProfileSchema), ProfileController.update);

router.route('/update-avatar')
  .put(passportJWT, upload().single('avatar'), ProfileController.updateAvatar);

module.exports = router;
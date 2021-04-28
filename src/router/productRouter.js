const express = require('express');
const router = require('express-promise-router')();
const multer = require('multer');
const passport = require('passport');
const passportConf = require('../app/middlewares/passportMiddleware');
const ProductController = require('../app/controllers/productController');
const {validateParam, validateBody, schemas} = require('../app/middlewares/routeValidationMiddleware');
const {upload} = require('../app/middlewares/fileUploadMiddleware');

const passportJWT = passport.authenticate('jwt', {session: false});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage/product/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

router.route('/')
  .get(passportJWT, ProductController.index)
  .post(passportJWT, validateBody(schemas.createProductSchema), ProductController.create);

router.route('/:productId')
  .get(passportJWT, validateParam(schemas.idSchema, 'productId'), ProductController.retrieveById)
  .put(passportJWT, validateParam(schemas.idSchema, 'productId'), validateBody(schemas.updateProductSchema), ProductController.updateById)
  .delete(passportJWT, validateParam(schemas.idSchema, 'productId'), ProductController.deleteById);

router.route('/:productId/update-image')
  .put(passportJWT, validateParam(schemas.idSchema, 'productId'), upload({storage}).single('image'), ProductController.updateImageById);

module.exports = router;
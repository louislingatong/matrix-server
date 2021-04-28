const Joi = require('@hapi/joi');
const _ = require('lodash');

const authSchemas = require('../helpers/routeSchemas/authRouteSchemas');
const profileSchemas = require('../helpers/routeSchemas/profileRouteSchemas');
const orderSchemas = require('../helpers/routeSchemas/orderRouteSchemas');
const sellerProductSchemas = require('../helpers/routeSchemas/sellerProductRouteSchemas');
const productSchemas = require('../helpers/routeSchemas/productRouteSchemas');
const paymentMethodSchemas = require('../helpers/routeSchemas/paymentMethodRouteSchemas');

const Error = require('../helpers/errorHelper');

const schemas = {
  idSchema: Joi.object().keys({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  ...authSchemas,
  ...profileSchemas,
  ...orderSchemas,
  ...sellerProductSchemas,
  ...productSchemas,
  ...paymentMethodSchemas
};

const validateParam = (schema, name) => {
  return (req, res, next) => {
    const result = schema.validate({param: req['params'][name]});
    if (result.error) {
      const message = result.error.details[0].message;
      next(Error.badRequest(message));
      return;
    }
    next();
  }
};

const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.validate({...req.body, ...req.query});
    if (result.error) {
      const name = result.error.details[0].context.label;
      const message = result.error.details[0].message;
      next(Error.unprocessableEntity({[name]: message}));
      return;
    }
    next();
  }
};

module.exports = {
  validateParam,
  validateBody,
  schemas
};

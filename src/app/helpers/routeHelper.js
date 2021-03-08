const Joi = require('@hapi/joi');
const { parseError } = require('./errorHelper');
const authSchemas = require('./routeSchemas/authRouteSchema');
const profileSchemas = require('./routeSchemas/profileRouteSchema');

module.exports = {
  validateParam: (schema, name) => {
    return (req, res, next) => {
      const result = schema.validate({ param: req['params'][name]});
      if (result.error) {
        const message = result.error.details[0].message;
        return parseError(res, 400, message);
      }
      next();
    }
  },

  validateBody: (schema) => {
    return (req, res, next) => {
      const result = schema.validate(req.body);
      if (result.error) {
        const name = result.error.details[0].context.label;
        const message = result.error.details[0].message;
        return parseError(res, 422, {[name]: message});
      }
      next();
    }
  },

  schemas: {
    idSchema: Joi.object().keys({
      param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    ...authSchemas,
    ...profileSchemas
  }
};

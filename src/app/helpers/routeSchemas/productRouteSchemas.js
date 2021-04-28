const Joi = require('@hapi/joi');

const schemas = {
  createProductSchema: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required(),
    memberPrice: Joi.number().required(),
  }),

  updateProductSchema: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required(),
    memberPrice: Joi.number().required(),
  })
};

module.exports = schemas;
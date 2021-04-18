const Joi = require('@hapi/joi');

const schemas = {
  retrieveAllSellerProductSchema: Joi.object().keys({
    ownerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
  })
};

module.exports = schemas;
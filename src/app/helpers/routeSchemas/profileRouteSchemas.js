const Joi = require('@hapi/joi');

const schemas = {
  updateProfileSchema: Joi.object().keys({
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  })
};

module.exports = schemas;
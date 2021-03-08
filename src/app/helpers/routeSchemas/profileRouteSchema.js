const Joi = require('@hapi/joi');

module.exports = {
  updateSchema: Joi.object().keys({
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  }),
}
const Joi = require('@hapi/joi');

const schemas = {
  createPaymentMethodSchema: Joi.object().keys({
    name: Joi.string().required(),
    receiverName: Joi.string().required(),
    receiverPhoneNumber: Joi.string().required(),
    receiverAddress: Joi.string().required(),
  }),

  updatePaymentMethodSchema: Joi.object().keys({
    name: Joi.string().required(),
    receiverName: Joi.string().required(),
    receiverPhoneNumber: Joi.string().required(),
    receiverAddress: Joi.string().required(),
  })
};

module.exports = schemas;
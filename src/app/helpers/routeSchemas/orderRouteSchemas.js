const Joi = require('@hapi/joi');

const item = Joi.object().keys({
  itemId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  owner: Joi.string(),
  product: Joi.string(),
  price: Joi.number(),
  quantity: Joi.number().integer().min(1).required(),
  refModel: Joi.string().valid('product', 'sellerProduct')
});

const schemas = {
  createOrderSchema: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    province: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    barangay: Joi.string().required(),
    country: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    paymentMethodId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    items: Joi.array().min(1).items(item)
  }),

  completeOrderPaymentSchema: Joi.object().keys({
    amount: Joi.number().required(),
    ctrlRefNumber: Joi.string().required(),
  }),

  updateOrderStatusSchema: Joi.object().keys({
    status: Joi.string().valid('PENDING', 'PROCESSING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')
  }),

  checkEmailSchema: Joi.object().keys({
    email: Joi.string().email().required()
  }),

  issueEmailVerificationCodeSchema: Joi.object().keys({
    email: Joi.string().email().required()
  }),

  verifyEmailSchema: Joi.object().keys({
    code: Joi.string().required()
  }),
}

module.exports = schemas;
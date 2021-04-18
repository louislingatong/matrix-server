const paymentMethodService = require('../services/paymentMethodService');

const index = async (req, res, next) => {
  const list = await paymentMethodService.retrievePaymentMethods();
  res.status(200).json({list});
};

module.exports = {
  index
}
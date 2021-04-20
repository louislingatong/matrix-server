const paymentService = require('../services/paymentService');

const downloadById = async (req, res, next) => {
  const file = await paymentService.retrieveDownloadPaymentById(req.params['paymentId']);
  res.download(file.path, file.name);
};

module.exports = {
  downloadById
}
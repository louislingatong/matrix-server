const walletService = require('../services/walletService');

const retrieve = async (req, res, next) => {
  const data = await walletService.retrieveWalletByOwner(req.user)
  res.status(200).json({data});
};

module.exports = {
  retrieve
}
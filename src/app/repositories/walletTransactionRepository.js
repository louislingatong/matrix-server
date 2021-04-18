const WalletTransaction = require('../models/WalletTransaction');

const createWalletTransaction = async (data, session) => {
  try {
    const walletTransaction = new WalletTransaction(data);
    await walletTransaction.save({session});
    return walletTransaction;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createWalletTransaction
};
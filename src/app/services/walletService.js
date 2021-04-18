const walletRepository = require('../repositories/walletRepository');
const walletTransactionRepository = require('../repositories/walletTransactionRepository');

const createWallet = async (data, session) => {
  try {
    return await walletRepository.createWallet(data, session);
  } catch (e) {
    throw e;
  }
};

const createWalletTransaction = async (data, session) => {
  try {
    return await walletTransactionRepository.createWalletTransaction(data, session);
  } catch (e) {
    throw e;
  }
};

const retrieveWalletByOwner = async (owner, session) => {
  try {
    return await walletRepository.retrieveWallet({owner}, session);
  } catch (e) {
    throw e;
  }
};

const retrieveUpdateWallet = async (filter, data, session) => {
  try {
    return await walletRepository.retrieveUpdateWallet(filter, data, session);
  } catch (e) {
    throw e;
  }
};

const cashOutBalance = async () => {
  try {

  } catch (e) {
    throw e;
  }
};

module.exports = {
  createWallet,
  createWalletTransaction,
  retrieveWalletByOwner,
  retrieveUpdateWallet,
  cashOutBalance
}
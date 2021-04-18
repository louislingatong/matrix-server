const Wallet = require('../models/Wallet');

const createWallet = async (data, session) => {
  try {
    const wallet = new Wallet(data);
    await wallet.save({session});
    return wallet;
  } catch (e) {
    throw e;
  }
};

const retrieveWallet = async (filter, session) => {
  try {
    const wallet = await Wallet
      .findOne(filter)
      .select('balance')
      .session(session);
    return wallet;
  } catch (e) {
    throw e;
  }
};

const retrieveUpdateWallet = async (filter, data, session) => {
  try {
    const wallet = await Wallet
      .findOneAndUpdate(
        filter,
        data,
        {new: true, session}
      )
      .select('balance');
    return wallet;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createWallet,
  retrieveWallet,
  retrieveUpdateWallet
}
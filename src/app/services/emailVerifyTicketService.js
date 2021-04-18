const emailVerifyTicketRepository = require('../repositories/emailVerifyTicketRepository');

const createEmailVerifyTicket = async (data, session) => {
  try {
    return await emailVerifyTicketRepository.createEmailVerifyTicket(data, session);
  } catch (e) {
    throw e;
  }
};

const retrieveEmailVerifyTicket = async (filter, session) => {
  try {
    return await emailVerifyTicketRepository.retrieveEmailVerifyTicket(filter, session);
  } catch (e) {
    throw e;
  }
};

const retrieveUpdateEmailVerifyTicket = async (filter, data, session) => {
  try {
    return await emailVerifyTicketRepository.retrieveUpdateEmailVerifyTicket(filter, data, session);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createEmailVerifyTicket,
  retrieveEmailVerifyTicket,
  retrieveUpdateEmailVerifyTicket,
}
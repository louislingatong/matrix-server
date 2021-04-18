const EmailVerifyTicket = require('../models/EmailVerifyTicket');

const createEmailVerifyTicket = async (data, session) => {
  try {
    const ticket = new EmailVerifyTicket(data);
    await ticket.save({session});
    return ticket;
  } catch (e) {
    throw e;
  }
};

const retrieveEmailVerifyTicket = async (filter, session) => {
  try {
    const ticket = await EmailVerifyTicket
      .findOne(filter)
      .select('code email isVerified expireAt')
      .session(session);
    return ticket;
  } catch (e) {
    throw e;
  }
};

const retrieveUpdateEmailVerifyTicket = async (filter, data, session) => {
  try {
    const ticket = await EmailVerifyTicket
      .findOneAndUpdate(filter, data, {new: true, upsert: true, session})
      .select('code email isVerified expireAt');
    return ticket;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createEmailVerifyTicket,
  retrieveEmailVerifyTicket,
  retrieveUpdateEmailVerifyTicket
}
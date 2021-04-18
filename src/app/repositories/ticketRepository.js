const Ticket = require('../models/Ticket');

const createTicket = async (data, session) => {
  try {
    const ticket = new Ticket(data);
    await ticket.save({session});
    return ticket;
  } catch (e) {
    throw e;
  }
};

const retrieveTicket = async (filter, session) => {
  try {
    const ticket = await Ticket
      .findOne(filter)
      .select('token expireAt')
      .session(session);
    return ticket;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  createTicket,
  retrieveTicket
}
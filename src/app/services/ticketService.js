const ticketRepository = require('../repositories/ticketRepository');

const createTicket = async (data, session) => {
  try {
    return await ticketRepository.createTicket(data, session);
  } catch (e) {
    throw e;
  }
};

const retrieveTicket = async (filter, session) => {
  try {
    return await ticketRepository.retrieveTicket(filter, session);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createTicket,
  retrieveTicket
}
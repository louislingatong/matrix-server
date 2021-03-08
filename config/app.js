module.exports = {
  domain: process.env.APP_DOMAIN || 'http://localhost:3000',
  ticketExpirationMinutes: parseInt(process.env.TICKET_EXPIRATION_MINUTES) || 1440,
}
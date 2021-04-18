module.exports = {
  domain: process.env.APP_DOMAIN || 'http://localhost:3000',
  ticketExpirationMinutes: parseInt(process.env.TICKET_EXPIRATION_MINUTES) || 1440,
  maxMembers: parseInt(process.env.MAX_MEMBERS) || 3,
  maxLevels: parseInt(process.env.MAX_LEVELS) || 4,
  level2To1Percentage: parseInt(process.env.LEVEL_2_TO_1_PERCENTAGE) || 10,
  level3To1Percentage: parseInt(process.env.LEVEL_3_TO_1_PERCENTAGE) || 7,
  level4To1Percentage: parseInt(process.env.LEVEL_4_TO_1_PERCENTAGE) || 5,
  timezone: process.env.APP_TIMEZONE || 'en-US',
  dateOptions: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }
}
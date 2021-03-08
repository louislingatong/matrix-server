module.exports = {
  service: process.env.MAIL_SERVICE || 'gmail',
  port: process.env.MAIL_PORT || 587,
  username: process.env.MAIL_USERNAME || '',
  password: process.env.MAIL_PASSWORD || '',
  fromAddress: process.env.MAIL_FROM_ADDRESS || 'dev.messenger.06@gmail.com'
}
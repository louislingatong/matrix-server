module.exports = {
  service: process.env.MAIL_SERVICE,
  port: process.env.MAIL_PORT,
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  fromAddress: process.env.MAIL_FROM_ADDRESS
}
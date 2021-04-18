const EventEmitter = require('events');
const mailer = require('../helpers/mailHelper');
const { app, mail } = require('../../../config');

const eventEmitter = new EventEmitter;

eventEmitter.on('sendVerifyEmailLink', async (name, email, token) => {
  const expiration = new Date().setMinutes(new Date().getMinutes() + app.ticketExpirationMinutes);
  const context = {
    name,
    verifyEmailLink: `${app.domain}/verify-email/${token}`,
    expiration: new Date(expiration).toLocaleString(app.timezone, app.dateOptions)
  }
  await mailer.sendEmail(mail.fromAddress, email, 'Email Verification', 'verifyEmail', context);
});

eventEmitter.on('sendResetPasswordLink', async (name, email, token) => {
  const expiration = new Date().setMinutes(new Date().getMinutes() + app.ticketExpirationMinutes);
  try {
    const context = {
      name,
      resetPasswordLink: `${app.domain}/reset-password/${token}`,
      expiration: new Date(expiration).toLocaleString(app.timezone, app.dateOptions)
    }

    await mailer.sendEmail(mail.fromAddress, email, 'Reset Password Notification', 'resetPassword', context);
  } catch (e) {
    throw e;
  }
});

module.exports = eventEmitter;

const EventEmitter = require('events');
const mailer = require('../helpers/mailHelper');
const { app, mail } = require('../../../config');

const eventEmitter = new EventEmitter;

eventEmitter.on('sendPayOrderLink', async (name, email, orderNumber, totalPayableAmount, paymentMethod) => {
  try {
    const context = {
      name,
      orderNumber,
      totalPayableAmount,
      payOrderLink: `${app.domain}/payment/${orderNumber}`,
      paymentMethod,
      helpers: {
        paymentMethodName: function(paymentMethod) {
          return paymentMethod.name;
        },
        ctrlRefNumber: function(paymentMethod) {
          return (paymentMethod.name === 'GCash') ? 'reference number' : 'control number';
        },
        ifeq: function(paymentMethod, options) {
          if (paymentMethod.name === 'GCash') {
            return options.fn({
              receiverName: paymentMethod.receiverName,
              receiverPhoneNumber: paymentMethod.receiverPhoneNumber
            });
          }
          return options.inverse({
            receiverName: paymentMethod.receiverName,
            receiverPhoneNumber: paymentMethod.receiverPhoneNumber,
            receiverAddress: paymentMethod.receiverAddress
          });
        }
      }
    }

    await mailer.sendEmail(mail.fromAddress, email, 'Payment Completion', 'paymentCompletion', context);
  } catch (e) {
    throw e;
  }
});

eventEmitter.on('sendVerifyEmailCode', async (email, code) => {
  const expiration = new Date().setMinutes(new Date().getMinutes() + app.ticketExpirationMinutes);
  const context = {
    code,
    expiration: new Date(expiration).toLocaleString(app.timezone, app.dateOptions)
  }
  await mailer.sendEmail(mail.fromAddress, email, 'Email Verification', 'verifyEmailCode', context);
});

module.exports = eventEmitter;
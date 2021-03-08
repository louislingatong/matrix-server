const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { mail } = require('../../../config');
const path = require('path');

const mailConfig = {
  service: mail.service,
  port: mail.port,
  secure: true,
  auth: {
    user: mail.username,
    pass: mail.password
  }
};

const transporter = nodemailer.createTransport(mailConfig);

const handlebarsOptions = {
  viewEngine: {
    defaultLayout: 'main',
    layoutsDir: path.resolve(__dirname, '../../../resources/views/mail/main-layout')
  },
  viewPath: path.resolve('./resources/views/mail'),
  extName: '.html',
};

transporter.use('compile', hbs(handlebarsOptions));

module.exports = {
  sendEmail: async (from, to, subject, template, context) => {
    try {
      await transporter.sendMail({from, to, subject, template, context});
    } catch (err) {
      console.log(err);
    };
  }
}
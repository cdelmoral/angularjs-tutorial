var nodemailer = require('nodemailer');

var Mailer = function() {};

var config = {
  host: process.env.MAILGUN_SMTP_SERVER,
  domain: process.env.MAILGUN_DOMAIN,
  port: process.env.MAILGUN_PORT,
  auth: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
  }
};

Mailer.transport = nodemailer.createTransport(config);

module.exports = Mailer;

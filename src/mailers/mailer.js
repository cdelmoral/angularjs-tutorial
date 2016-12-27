var nodemailer = require('nodemailer');

var config;

if (process.env.NODE_ENV === 'development') {
  var MailDev = require('maildev');
  var open = require('open');

  var maildev = new MailDev({ smtp: 1025 });
  maildev.listen();

  maildev.on('new', function(email){
    open('http://localhost:1080/#');
  });

  config = {
    host: process.env.MAILGUN_DOMAIN,
    port: process.env.MAILGUN_PORT,
    ignoreTLS: true
  };
} else if (process.env.NODE_ENV === 'production') {
  config = {
    host: process.env.MAILGUN_SMTP_SERVER,
    domain: process.env.MAILGUN_DOMAIN,
    port: process.env.MAILGUN_PORT,
    auth: { user: process.env.MAILGUN_SMTP_LOGIN, pass: process.env.MAILGUN_SMTP_PASSWORD }
  };
}
  
var Mailer = function() {};

Mailer.transport = nodemailer.createTransport(config);

module.exports = Mailer;

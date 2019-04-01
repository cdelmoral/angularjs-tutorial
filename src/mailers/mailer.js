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
    host: process.env.MAIL_DOMAIN,
    port: process.env.MAIL_PORT,
    ignoreTLS: true
  };

  console.log(config);
} else if (process.env.NODE_ENV === 'production') {
  config = {
    host: process.env.MAIL_SMTP_SERVER,
    domain: process.env.MAIL_DOMAIN,
    port: process.env.MAIL_PORT,
    auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD }
  };
}
  
var Mailer = function() {};

Mailer.transport = nodemailer.createTransport(config);

module.exports = Mailer;

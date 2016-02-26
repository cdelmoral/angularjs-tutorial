
var nodemailer = require('nodemailer');

var Mailer = function() {};

Mailer.transporter =
  nodemailer.createTransport('smtps://localhost:8000');

Mailer.mailOptions = {
  host: "smtp.gmail.com",
  domain: "smtp.gmail.com",
  port: "465",
  from: '"AngularJS tutorial" <angularjstutorial@gmail.com>',
  subject: 'Hello',
  text: 'Hello world',
  html: '<b>Hello world</b>'
};

Mailer.sendMail = function(user) {
  Mailer.mailOptions.to = user.email;
  Mailer.transporter.sendMail(Mailer.mailOptions, callback);
};

function callback(error, info) {
  if(error){
      return console.log(error);
  }
  console.log('Message sent: ' + info.response);
}

module.exports = Mailer;

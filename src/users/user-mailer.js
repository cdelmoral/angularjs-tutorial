
var path = require('path');

var Mailer = require('../mailers/mailer');
var EmailTemplate = require('email-templates').EmailTemplate;

var UserMailer = function() {};

var templateDir = path.join(__dirname, '..', 'templates', 'account-activation');
var accountActivation = new EmailTemplate(templateDir);

UserMailer.sendActivationEmail = function(user) {
  user.activation_link = process.env.HOST + '/#/users/activate/' + user.id + '/' + user.token;

  accountActivation.render(user, function(err, result) {
    if (err) {
      return console.log(err);
    }

    Mailer.transport.sendMail({
      from: 'noreply@angularjstutorial.com',
      to: user.email,
      subject: 'Account Activation',
      html: result.html
    }, transportCallback);
  });
};

function transportCallback(error, info) {
  if (error) {
      return console.log(error);
  }
  console.log('Message sent: ' + info.response);
}

module.exports = UserMailer;

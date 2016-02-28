
var path = require('path');

var Mailer = require('../mailers/mailer');
var EmailTemplate = require('email-templates').EmailTemplate;

var UserMailer = function() {};

var accountActivation = new EmailTemplate(path.join(__dirname, 'user-account-activation'));
var passwordReset = new EmailTemplate(path.join(__dirname, 'user-password-reset'));

UserMailer.sendActivationEmail = function(user) {
  user.activation_link = process.env.HOST + '/#/users/activate/' + user.id + '/' + user.token;
  sendEmail(accountActivation, user);
};

UserMailer.sendPasswordResetEmail = function(user) {
  user.password_reset_link = process.env.HOST + '/#/password_resets/' + user._id + '/' +
    user.reset_token;
  sendEmail(passwordReset, user);
};

module.exports = UserMailer;

function transportCallback(error, info) {
  if (error) {
      return console.log(error);
  }
  console.log('Message sent: ' + info.response);
}

function sendEmail(template, user) {
  template.render(user, function(err, result) {
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
}

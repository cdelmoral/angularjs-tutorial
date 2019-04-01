
var path = require('path');

var Mailer = require('../mailers/mailer');
var Logger = require('../logger/logger');
var EmailTemplate = require('email-templates');

var UserMailer = function() {};

var email = new EmailTemplate({
  views: {
    options: {
      extension: 'ejs'
    }
  }
});

UserMailer.sendActivationEmail = function(user) {
  var activationLink = process.env.CLIENT_HOST + '/activate/' + user.id + '/' + user.token;
  const templatePath = path.join(__dirname, 'user-account-activation', 'user-account-activation.text');
  sendEmailWithLink(templatePath, 'Account Activation',  user, activationLink);
};

UserMailer.sendPasswordResetEmail = function(user) {
  var passwordResetLink = process.env.CLIENT_HOST + '/password_resets/' + user._id + '/' +
    user.reset_token;
  const templatePath = path.join(__dirname, 'user-password-reset', 'user-password-reset.text');
  sendEmailWithLink(passwordReset, 'Password Reset', user, passwordResetLink);
};

module.exports = UserMailer;

function transportCallback(error, info) {
  if (error) {
      return console.log(error);
  }
}

function sendEmailWithLink(templatePath, subject, user, link) {
  var params = {
    name: user.name,
    link: link
  };

  email.render(templatePath, params).then(result => {
    console.log(result);
    Mailer.transport.sendMail({
      from: 'noreply@angularjstutorial.com',
      to: user.email,
      subject: subject,
      html: result
    }, transportCallback);
  }).catch(Logger.logError);
}

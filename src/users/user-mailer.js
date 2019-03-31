
// var path = require('path');

// var Mailer = require('../mailers/mailer');
// var Logger = require('../logger/logger');
// var EmailTemplate = require('email-templates').EmailTemplate;

var UserMailer = function() {};

// var accountActivation = new EmailTemplate(path.join(__dirname, 'user-account-activation'));
// var passwordReset = new EmailTemplate(path.join(__dirname, 'user-password-reset'));

UserMailer.sendActivationEmail = function(user) {
  // var activationLink = process.env.CLIENT_HOST + '/activate/' + user.id + '/' + user.token;
  // sendEmailWithLink(accountActivation, user, activationLink);
};

UserMailer.sendPasswordResetEmail = function(user) {
  // var passwordResetLink = process.env.CLIENT_HOST + '/password_resets/' + user._id + '/' +
  //   user.reset_token;
  // sendEmailWithLink(passwordReset, user, passwordResetLink);
};

module.exports = UserMailer;

// function transportCallback(error, info) {
//   if (error) {
//       return console.log(error);
//   }
// }

// function sendEmailWithLink(template, user, link) {
//   var params = user.toObject();
//   params.link = link;

//   template.render(params, function(err, result) {
//     if (err) {
//       return Logger.logError(err);
//     }

//     Mailer.transport.sendMail({
//       from: 'noreply@angularjstutorial.com',
//       to: user.email,
//       subject: 'Account Activation',
//       html: result.html
//     }, transportCallback);
//   });
// }

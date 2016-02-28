var express = require('express');
var router = express.Router();

var User = require('../users/user-model');
var InvalidPasswordResetLinkError = require('./invalid-password-reset-error');
var Logger = require('../logger/logger');

var PasswordResetsController = function() {};

PasswordResetsController.valid = function(req, res, next) {
  User.findByIdAsync(req.query.id).then(function(user) {
    return user && user.activated && user.reset_digest &&
      user.authenticated(req.query.token, 'reset_digest');
  }).then(function(valid) {
    if (valid) {
      res.status(200).send();
    } else {
      res.status(400).send('Invalid reset link.');
    }
  }).catch(Logger.logError);
};

/** Creates a new password reset. */
PasswordResetsController.create = function(req, res, next) {
  User.findOneAsync(req.body).then(function(user) {
    if (user) {
      return user.createResetDigest();
    } else {
      return res.status(403).send('User not yet activated.');
    }
  }).then(function(user) {
    return user.sendPasswordResetEmail();
  }).then(function() {
    res.status(200).json({
      message: 'An email was sent with instructions to reset your password.'
    });
  }).catch(Logger.logError);
};

PasswordResetsController.update = function(req, res, next) {
  User.findByIdAsync(req.params.id).then(function(user) {
    req.user = user;
    return (user && user.authenticated(req.params.token, 'reset_digest'));
  }).then(function(valid) {
    if (valid) {
      req.user.password = req.body.password;
      return req.user.save();
    } else {
      throw new InvalidPasswordResetLinkError('Invalid reset link.');
    }
  }).then(function(user) {
    res.status(200).json({ message: 'Use your new password to log in.' });
  }).catch(InvalidPasswordResetLinkError, function(error) {
    res.status(400).send('Invalid reset link.');
  }).catch(Logger.logError);
};

module.exports = PasswordResetsController;

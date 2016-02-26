var Promise = require('bluebird');
var mongoose = require('mongoose');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var crypto = Promise.promisifyAll(require('crypto'));

var UserSchema = require('./user-schema');

UserSchema.statics.createToken = function() {
  return crypto.randomBytesAsync(48).then(function(buf) {
    return buf.toString('hex');
  });
};

UserSchema.statics.digest = function(token) {
  return bcrypt.hashAsync(token, 8);
};

UserSchema.methods.authenticated = function(password, field) {
  var user = this;
  return bcrypt.compareAsync(password, user[field]);
};

UserSchema.methods.activate = function(token) {
  var user = this;
  user.activated = true;
  user.activated_at = Date.now();
  user.activation_digest = null;
  return user.save();
};

UserSchema.methods.createResetDigest = function() {
  var user = this;
  return User.createToken().then(function(token) {
    user.reset_token = token;
    return User.digest(token);
  }).then(function(hash) {
    user.reset_digest = hash;
    user.reset_sent_at = Date.now();
    return user.save();
  });
};

UserSchema.methods.sendActivationEmail = function(token) {
  var user = this;
  console.log('The activation link for ' + user.name +
    ' is /#/users/activate/' + user._id + '/' + token);
};

UserSchema.methods.sendPasswordResetEmail = function() {
  var user = this;
  console.log('The reset link for ' + user.name +
    ' is /#/password_resets/' + user._id + '/' + user.reset_token);
};

var User = Promise.promisifyAll(mongoose.model('User', UserSchema));

module.exports = User;

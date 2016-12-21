var Promise = require('bluebird');
var mongoose = require('mongoose');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var crypto = Promise.promisifyAll(require('crypto'));

var UserSchema = require('./user-schema');
var UserMailer = require('./user-mailer');
var Relationship = require('./relationship-model');

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

UserSchema.methods.sendActivationEmail = function() {
  var user = this;
  UserMailer.sendActivationEmail(user);
};

UserSchema.methods.sendPasswordResetEmail = function() {
  var user = this;
  UserMailer.sendPasswordResetEmail(user);
};

UserSchema.methods.isFollowing = function(followed) {
  var user = this;
  var filter = { follower_id: user._id, followed_id: followed._id };
  return Relationship.find(filter).then(function(rels) {
    return rels.length !== 0;
  });
};

UserSchema.methods.follow = function(followed) {
  var user = this;
  return Relationship.create({ follower_id: user._id, followed_id: followed._id })
    .then(function(relationship) {
      user.following_count++;
      return user.save();
    }).then(function(user) {
      followed.followers_count++;
      return followed.save();
    });
};

UserSchema.methods.unfollow = function(followed) {
  var user = this;
  return Relationship.remove({ follower_id: user._id, followed_id: followed._id })
    .then(function(relationship) {
      user.following_count--;
      return user.save();
    }).then(function(user) {
      followed.followers_count--;
      return followed.save();
    });
};

var User = Promise.promisifyAll(mongoose.model('User', UserSchema));

module.exports = User;

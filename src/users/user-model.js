var Promise = require('bluebird');
var mongoose = require('mongoose');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var crypto = Promise.promisifyAll(require('crypto'));

var UserSchema = require('./user-schema');
var UserMailer = require('./user-mailer');

UserSchema.pre('save', true, function(next, done) {
  var user = this;
  var promises = [];

  if (user.isNew) {
    promises.push(generateActivationToken(user));
  }

  if (user.isModified('email')) {
    promises.push(downcaseEmail(user));
    promises.push(createGravatarId(user));
  }

  if (user.isModified('password')) {
    promises.push(hashPassword(user));
  }

  Promise.all(promises).then(function(result) {
    done();
  });

  next();
});

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

UserSchema.statics.createToken = function() {
  return crypto.randomBytesAsync(48).then(function(buf) {
    return buf.toString('hex');
  });
};

UserSchema.statics.digest = function(token) {
  return bcrypt.hashAsync(token, 8);
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
  console.log('The activation link for ' + user.name +
    ' is /#/users/activate/' + user._id + '/' + user.token);
};

UserSchema.methods.sendPasswordResetEmail = function() {
  var user = this;
  console.log('The reset link for ' + user.name +
    ' is /#/password_resets/' + user._id + '/' + user.reset_token);
};

var User = Promise.promisifyAll(mongoose.model('User', UserSchema));

module.exports = User;

function downcaseEmail(user) {
  return Promise.resolve().then(function() {
    user.email = user.email.toLowerCase();
    return;
  });
}

function createGravatarId(user) {
  return Promise.resolve().then(function() {
    user.gravatar_id = crypto.createHash('md5').update(user.email.toLowerCase()).digest('hex');
    return;
  });
}

function hashPassword(user) {
  return Promise.resolve().then(function() {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    return;
  });
}

function generateActivationToken(user) {
  return Promise.resolve().then(function() {
    user.token = crypto.randomBytes(48).toString('hex');
    user.activation_digest = bcrypt.hashSync(user.token, 8);
    user.sendActivationEmail();
    return;
  });
}

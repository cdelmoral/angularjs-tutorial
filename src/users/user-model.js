var Promise = require('bluebird');
var mongoose = require('mongoose');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var crypto = Promise.promisifyAll(require('crypto'));

var Micropost = require('../microposts/micropost-model');
var UserSchema = require('./user-schema');
var UserNotFoundException = require('./user-not-found-exception');
var UserActivationException = require('./user-activation-exception');
var UserPasswordResetException = require('./user-password-reset-exception');
var UserCredentialsException = require('./user-credentials-exception');

/** Lowercases email and creates gravatar id from it. */
UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('email')) {
    user.email = user.email.toLowerCase();
    user.gravatar_id = crypto.createHash('md5').update(user.email).digest('hex');
  }
  next();
});

/** Hashes password. */
UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  }
  next();
});

/** Generate and send activation token for created users. */
UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isNew) {
    var token = crypto.randomBytes(48).toString('hex');
    user.activation_digest = bcrypt.hashSync(token, 8);
    user.sendActivationEmail(token);
  }
  next();
});

UserSchema.statics.getUserById = function(id) {
  return User.findByIdAsync(id).then(function(user) {
    if (!user) {
      throw new UserNotFoundException('User not found.');
    }
    return user;
  });
};

UserSchema.statics.getUserByEmail = function(email) {
  return User.findOneAsync({ email: email.toLowerCase() }).then(function(user) {
    if (!user) {
      throw new UserNotFoundException('User not found.');
    }
    return user;
  });
};

UserSchema.statics.getAuthenticatedUserByEmail = function(email, password) {
  return User.getUserByEmail(email).then(function(user) {
    if (user.activated) {
      return bcrypt.compareAsync(password, user.password).then(function(valid) {
        if (valid) {
          return user;
        }
        throw new UserCredentialsException('Invalid credentials.');
      });
    }
    throw new UserActivationException('User has not been activated yet.');
  });
};

UserSchema.methods.isValidPassword = function(password) {
  var user = this;
  return bcrypt.compareAsync(password, user.password);
};

UserSchema.methods.activate = function(token) {
  var user = this;
  return Promise.resolve()
    .then(function() {
      if (user.activated) {
        throw new UserActivationException('User is already activated.');
      }
      return bcrypt.compareAsync(token, user.activation_digest);
    }).then(function(isValid) {
      if (!isValid) {
        throw new UserActivationException('Invalid activation token.');
      }
      var update = { activated: true, activated_at: Date.now(), activation_digest: null };
      return User.findOneAndUpdateAsync({ _id: user.id }, { $set: update }, { new: true });
    });
};

UserSchema.methods.isValidResetToken = function(token, callback) {
  var user = this;
  return Promise.resolve().then(function() {
    if (!user.reset_digest) {
      throw new UserPasswordResetException('User does not have reset digest.');
    }
    return bcrypt.compareAsync(token, user.reset_digest);
  });
};

UserSchema.methods.resetPassword = function(token, newPassword) {
  var user = this;
  return user.isValidResetToken(token).then(function(isValid) {
    if (!isValid) {
      throw new UserPasswordResetException('Invalid reset token.');
    }
    return bcrypt.genSaltAsync(10).then(function(salt) {
      return bcrypt.hashAsync(newPassword, salt);
    }).then(function(hash) {
      var update = { password: hash, reset_digest: null, reset_password_at: Date.now() };
      return User.findOneAndUpdateAsync({ _id: user.id }, { $set: update }, { new: true });
    });
  });
};

UserSchema.methods.sendActivationEmail = function(token) {
  var user = this;
  console.log('The activation link for ' + user.name +
    ' is /#/users/activate/' + user._id + '/' + token);
};

UserSchema.methods.createAndSendResetDigest = function() {
  var user = this;
  return crypto.randomBytesAsync(48).then(function(buf) {
    return buf.toString('hex');
  }).then(function(token) {
    return bcrypt.hashAsync(token, 8).then(function(hash) {
      user.reset_digest = hash;
      user.reset_sent_at = Date.now();
      return user.saveAsync();
    }).then(function(user) {
      user.sendResetEmail(token);
    });
  });
};

UserSchema.methods.sendResetEmail = function(token) {
  var user = this;
  console.log('The reset link for ' + user.name +
    ' is /#/password_resets/' + user._id + '/' + token);
};

UserSchema.methods.createMicropost = function(content) {
  var user = this;
  return Micropost.createAsync({ user_id: user._id, content: content }).then(function(micropost) {
    return User.findOneAndUpdateAsync({ _id: user.id }, { $inc: { microposts_count: 1 } });
  });
};

UserSchema.methods.deleteMicropostById = function(micropostId) {
  var user = this;
  return Micropost.findOneAndRemoveAsync({ _id: micropostId }).then(function(micropost) {
    return User.findOneAndUpdateAsync({ _id: user.id }, { $inc: { microposts_count: -1 } });
  });
};

var User = Promise.promisifyAll(mongoose.model('User', UserSchema));

module.exports = User;

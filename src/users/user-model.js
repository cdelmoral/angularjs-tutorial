var Promise = require('bluebird');
var mongoose = require('mongoose');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var crypto = Promise.promisifyAll(require('crypto'));

var Micropost = require('../microposts/micropost-model');
var UserSchema = require('./user-schema');
var UserNotFoundException = require('./user-not-found-exception');
var UserActivationException = require('./user-activation-exception');
var UserPasswordResetException = require('./user-password-reset-exception');

UserSchema.statics.isUnique = function(option, id) {
    return User.findOne(option).then(function(user) {
        return (user === null || user.id === id);
    });
};

UserSchema.statics.getUsersPage = function(pageNumber, usersPerPage) {
    var skipUsers = (pageNumber - 1) * usersPerPage;
    var sort = { created_at: 1 };
    var params = { limit: usersPerPage, skip: skipUsers, sort: sort };

    return User.find({}, null, params).then(function(users) {
        return users;
    });
};

UserSchema.statics.getObjects = function(users) {
    var objects = [];
    for (var i = 0; i < users.length; i++) {
        objects.push(users[i].getObject());
    }
    return objects;
};

UserSchema.statics.getUsersCount = function() {
    return User.count({}).then(function(count) {
        return count;
    });
};

UserSchema.statics.getUserById = function(id) {
    return User.findById(id).then(function(user) {
        if (!user) {
            throw new UserNotFoundException('User not found.');
        }
        return user;
    });
};

UserSchema.statics.getUserByEmail = function(email) {
    return User.findOne({ email: email.toLowerCase() }).then(function(user) {
        if (!user) {
            throw new UserNotFoundException('User not found.');
        }
        return user;
    });
};

UserSchema.statics.updateUserById = function(id, name, email, password) {
    var update = { name: name, email: email, password: password };

    return bcrypt.genSaltAsync(10)
        .then(function(salt) {
            return bcrypt.hashAsync(update.password, salt);
        }).then(function(hash) {
            update.password = hash;
            return User.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });
        }).then(function(user) {
            return user;
        });
};

UserSchema.statics.createNewUser = function(name, email, password) {
    return User.createAsync({ name: name, email: email, password: password });
};

UserSchema.statics.removeUserById = function(id) {
    return User.findByIdAndRemove(id);
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
            user.activated = true;
            user.activated_at = Date.now();
            return user.save();
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
        user.password = newPassword;
        user.reset_digest = null;
        user.reset_password_at = Date.now();
        return user.save();
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
            return user.save();
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

UserSchema.methods.getObject = function() {
    var user = this;
    var jsonUser = user.toJSON({ versionKey: false });

    jsonUser.id = jsonUser._id;
    delete jsonUser._id;
    delete jsonUser.password;
    delete jsonUser.schema_version;
    delete jsonUser.activation_digest;
    delete jsonUser.reset_digest;
    delete jsonUser.reset_sent_at;
    delete jsonUser.reset_password_at;

    return jsonUser;
};

UserSchema.methods.createMicropost = function(content) {
    var user = this;
    return Micropost.createAsync({ user_id: user._id, content: content }).then(function(micropost) {
        return User.findOneAndUpdate({ _id: user.id }, { $inc: { microposts_count: 1 } });
    });
};

UserSchema.methods.deleteMicropostById = function (micropostId) {
    var user = this;
    return Micropost.findOneAndRemove({ _id: micropostId }).then(function(micropost){
        return User.findOneAndUpdate({ _id: user.id }, { $inc: { microposts_count: -1 } });
    });
};

var User = Promise.promisifyAll(mongoose.model('User', UserSchema));

module.exports = User;

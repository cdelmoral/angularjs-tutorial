var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

var Micropost = require('../microposts/micropost-model');
var userSchema = require('./user-schema');
var handleError = require('../common/error-handling').handleError;
var upgradeSchema = require('./user-migrations').upgradeSchema;
var downgradeSchema = require('./user-migrations').downgradeSchema;
var currentSchemaVersion = require('./user-migrations').currentSchemaVersion;

userSchema.pre('save', initializeUser);
userSchema.post('init', handleMigrations);

userSchema.statics.isNameAvailable = isNameAvailable;
userSchema.statics.isEmailAvailable = isEmailAvailable;
userSchema.statics.getUsersPage = getUsersPage;
userSchema.statics.getUsersCount = getUsersCount;
userSchema.statics.getUserById = getUserById;
userSchema.statics.getUserByEmail = getUserByEmail;
userSchema.statics.updateUserById = updateUserById;
userSchema.statics.createNewUser = createNewUser;
userSchema.statics.removeUserById = removeUserById;

userSchema.methods.isValidPassword = isValidPassword;
userSchema.methods.isValidActivationToken = isValidActivationToken;
userSchema.methods.isValidResetToken = isValidResetToken;
userSchema.methods.activate = activate;
userSchema.methods.sendActivationEmail = sendActivationEmail;
userSchema.methods.createAndSendResetDigest = createAndSendResetDigest;
userSchema.methods.sendResetEmail = sendResetEmail;
userSchema.methods.getObject = getObject;
userSchema.methods.createMicropost = createMicropost;

var User = mongoose.model('User', userSchema);

module.exports = User;

function handleMigrations(user) {
    if (!user.schema_version) {
        user.schema_version = 0;
    }

    if (user.schema_version < currentSchemaVersion) {
        upgradeSchema(user);
    } else if (user.schema_version > currentSchemaVersion) {
        downgradeSchema(user);
    }
}

function initializeUser(next) {
    var user = this;

    user.schema_version = currentSchemaVersion;
    user.email = user.email.toLowerCase();

    if (!user.isModified('password')) {
        return next();
    }

    generateToken().then(function(token) {
        digest(token, 8).then(function(hash) {
            user.activation_digest = hash;
            user.sendActivationEmail(token);
        });
    });

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }

        digest(user.password, salt).then(function(hash) {
            user.password = hash;
            next();
        });
    });
}

function isNameAvailable(name, id) {
    var promise = new Promise(function(resolve, reject) {
        User.findOne({ name: name }, function(err, user) {
            handleError(reject, err);

            resolve(user === null || user.id === id);
        });
    });

    return promise;
}

function isEmailAvailable(email, id) {
    var promise = new Promise(function(resolve, reject) {
        User.findOne({ email: email.toLowerCase() }, function(err, user) {
            handleError(reject, err);

            resolve(user === null || user.id === id);
        });
    })

    return promise; 
}

function getUsersPage(pageNumber, usersPerPage) {
    var skipUsers = (pageNumber - 1) * usersPerPage;
    var sort = { created_at: 1 };
    var params = { limit: usersPerPage, skip: skipUsers, sort: sort };

    var promise = new Promise(function(resolve, reject) {
        User.find({}, null, params, function (err, users) {
            handleError(reject, err);

            var retUsers = [];
            for (var i = 0; i < users.length; i++) {
                retUsers.push({
                    id: users[i]._id,
                    name: users[i].name,
                    email: users[i].email
                });
            };

            resolve(retUsers);
        });
    });

    return promise;
}

function getUsersCount() {
    var promise = new Promise(function(resolve, reject) {
        User.count({}, function (err, count) {
            handleError(reject, err);

            resolve(count);
        });
    });

    return promise;    
}

function getUserById(id) {
    var promise = new Promise(function(resolve, reject) {
        User.findById(id, function(err, user) {
            handleError(reject, err);

            if (user) {
                resolve(user);
            } else {
                reject('No user found.')
            }
        });
    });

    return promise;
}

function getUserByEmail(email) {
    var promise = new Promise(function(resolve, reject) {
        User.findOne({ email: email.toLowerCase() }, function (err, user) {
            handleError(reject, err);

            if (user) {
                resolve(user);
            } else {
                reject('No user found.')
            }
        });
    });

    return promise;
}

function updateUserById(id, name, email, password) {
    var update = { name: name, email: email, password: password };

    var promise = new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, function(err, salt) {
            handleError(reject, err);

            digest(update.password, salt).then(function(hash) {
                update.password = hash;
                User.findOneAndUpdate({ _id: id }, { $set: update }, { new: true }, function (err, user) {
                    handleError(reject, err);

                    resolve(user);
                });
            });
        });
    });

    return promise;
}

function removeUserById(id) {
    var promise = new Promise(function(resolve, reject) {
        User.findByIdAndRemove(id, function(err) {
            handleError(reject, err);

            resolve();
        });
    });

    return promise;
}

function createNewUser(name, email, password) {
    var promise = new Promise(function(resolve, reject) {
        User.create({ name: name, email: email, password: password }, function (err, user) {
            handleError(reject, err);

            resolve();
        });
    });

    return promise;
}

function isValidActivationToken(token, callback) {
    var user = this;
    return bcrypt.compareSync(token, user.activation_digest);
}

function isValidPassword(password, callback) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
}

function isValidResetToken(token, callback) {
    var user = this;
    return user.reset_digest && bcrypt.compareSync(token, user.reset_digest);
}

function activate() {
    var user = this;
    user.activated = true;
    user.activated_at = Date.now();
    user.save();
}

function sendActivationEmail(token) {
    var user = this;
    console.log('The activation link for ' + user.name +
        ' is /#/users/activate/' + user._id + '/' + token);
}

function createAndSendResetDigest() {
    var user = this;
    generateToken().then(function(token) {
        digest(token, 8).then(function(hash) {
            user.reset_digest = hash;
            user.reset_sent_at = Date.now();
            user.save(function(err, user) {
                user.sendResetEmail(token);
            });
        });
    });
}

function sendResetEmail(token) {
    var user = this;
    console.log('The reset link for ' + user.name +
        ' is /#/password_resets/' + user._id + '/' + token);
}

function getObject() {
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
}

function createMicropost(content) {
    var user = this;

    var promise = new Promise(function(resolve, reject) {
        Micropost.create({ user_id: user._id, content: content }, function (err, micropost) {
            handleError(reject, err);

            user.microposts_count = user.microposts_count + 1;
            user.save(function(err, user) {
                handleError(reject, err);
                resolve(user);
            });
        });
    });

    return promise;
}

function generateToken() {
    return new Promise(function(resolve, reject) {
        crypto.randomBytes(48, function(ex, buf) {
            var token = buf.toString('hex');
            return resolve(token);
        })
    });
}

function digest(string, salt) {
    return new Promise(function(resolve, reject) {
        bcrypt.hash(string, salt, function(err, hash) {
            if (err) {
                return reject(err);
            }

            return resolve(hash);
        });
    });
}

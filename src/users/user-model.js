var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

var validate = require('../common/validator');
var upgradeSchema = require('./user-migrations').upgradeSchema;
var downgradeSchema = require('./user-migrations').downgradeSchema;
var currentSchemaVersion = require('./user-migrations').currentSchemaVersion;

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [
            validate({ validator: 'isNotWhiteSpace'}),
            validate({ validator: 'isLength', arguments: [0, 50]})
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            validate({ validator: 'isNotWhiteSpace' }),
            validate({ validator: 'isLength', arguments: [0, 255]}),
            validate({ validator: 'isEmail' })
        ]
    },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    schema_version: { type: Number, default: currentSchemaVersion },
    activation_digest: { type: String },
    activated: { type: Boolean, default: false },
    activated_at: { type: Date },
    reset_digest: { type: String },
    reset_sent_at: { type: Date },
    reset_password_at: { type: Date },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
});

userSchema.post('init', handleMigrations);
userSchema.pre('save', initializeUser);
userSchema.methods.isValidPassword = isValidPassword;
userSchema.methods.isValidActivationToken = isValidActivationToken;
userSchema.methods.isValidResetToken = isValidResetToken;
userSchema.methods.activate = activate;
userSchema.methods.sendActivationEmail = sendActivationEmail;
userSchema.methods.createAndSendResetDigest = createAndSendResetDigest;
userSchema.methods.sendResetEmail = sendResetEmail;

module.exports = mongoose.model('User', userSchema);

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

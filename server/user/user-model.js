var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var validate = require('../common/validator');

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
    password: {
        type: String,
        required: true
    },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
});

userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.isValidPassword = function(password, callback) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
    // bcrypt.compare(password, user.password, funtion(err, res) {

    // });
};

module.exports = mongoose.model('User', userSchema);

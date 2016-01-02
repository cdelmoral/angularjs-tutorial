var bcrypt = require('bcrypt');
var crypto = require('crypto');

exports.generateToken = function() {
    return new Promise(function(resolve, reject) {
        crypto.randomBytes(48, function(ex, buf) {
            var token = buf.toString('hex');
            return resolve(token);
        });
    });
};

exports.digest = function(string, salt) {
    return new Promise(function(resolve, reject) {
        bcrypt.hash(string, salt, function(err, hash) {
            if (err) {
                return reject(err);
            }

            return resolve(hash);
        });
    });
};

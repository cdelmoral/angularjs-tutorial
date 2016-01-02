var express = require('express');
var router = express.Router();

var User = require('../users/user-model');
var UserNotFoundException = require('../users/user-not-found-exception');
var UserPasswordResetException = require('../users/user-password-reset-exception');

router.get('/valid_token', validateToken);
router.post('/', createPasswordReset);
router.put('/:id/:token', updatePassword);

module.exports = router;

function validateToken(req, res, next) {
    User.getUserById(req.query.id).then(function(user) {
        return user.isValidResetToken(req.query.token);
    }).then(function(isValid) {
        if (isValid) {
            res.status(200).send();
        } else {
            res.status(400).send('Invalid reset link.');
        }
    }).catch(UserNotFoundException, function(message) {
        res.status(400).send('Invalid reset link.');
    }).catch(UserPasswordResetException, function(message) {
        res.status(400).send('Invalid reset link.');
    }).catch(console.log.bind(console));
}

/** Creates a new password reset. */
function createPasswordReset(req, res, next) {
    User.getUserByEmail(req.body.email).then(function(user) {
        if (user.activated) {
            return user.createAndSendResetDigest().then(function() {
                res.status(200).json({
                    message: 'An email was sent with instruction to reset your password.'
                });
            });
        } else {
            res.status(403).send('User not yet activated.');
        }
    }).catch(UserNotFoundException, function(message) {
        res.status(404).send('Email address not found.');
    }).catch(console.log.bind(console));
}

function updatePassword(req, res, next) {
    User.getUserById(req.params.id).then(function(user) {
        return user.resetPassword(req.params.token, req.body.password).then(function(user) {
            res.status(200).json({ message: 'Use your new password to log in.' });
        });
    }).catch(UserNotFoundException, function(message) {
        res.status(400).send('Invalid reset link.');
    }).catch(UserPasswordResetException, function(message) {
        res.status(400).send('Invalid reset link.');
    }).catch(console.log.bind(console));
}

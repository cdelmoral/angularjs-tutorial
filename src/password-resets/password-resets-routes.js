var express = require('express');
var router = express.Router();

var User = require('../users/user-model');
var handleError = require('../common/error-handling').handleError;

router.get('/valid_token', validateToken);
router.post('/', createPasswordReset);
router.put('/:id/:token', updatePassword);

module.exports = router;

function validateToken(req, res, next) {
    User.findById(req.query.id, function(err, user) {
        handleError(err);

        if (user && user.isValidResetToken(req.query.token)) {
            res.status(200).send();
        } else {
            res.status(400).send('Invalid reset link.');
        }
    })
}

/** Creates a new password reset. */
function createPasswordReset(req, res, next) {
    User.findOne({ email: req.body.email.toLowerCase() }, function (err, user) {
        handleError(next, err);

        if (user) {
            if (user.activated) {
                user.createAndSendResetDigest();
                res.status(200).json({ message: 'An email was sent with instructions to reset your password.' });
            } else {
                res.status(403).send('User not yet activated.');
            }
        } else {
            res.status(404).send('Email address not found.');
        }
    });
}

function updatePassword(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        handleError(err);

        if (user && user.isValidResetToken(req.params.token)) {
            user.password = req.body.password;
            user.reset_digest = null;
            user.reset_password_at = Date.now();

            user.save(function(err, user) {
                handleError(err);

                res.status(200).json({ message: 'Use your new password to log in.' });
            })
        } else {
            res.status(400).send('Invalid reset link.');
        }
    });
}

var express = require('express');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../users/user-model');

var createSessionForUser = require('./sessions-helper').createSessionForUser;

router.get('/authenticated', isAuthenticated);
router.post('/', authenticateUser);
router.delete('/logout', endSession);

module.exports = router;

/** Authenticates a user. */
function authenticateUser(req, res, next) {
    User.findOne({ email: req.body.email.toLowerCase() }, function (err, user) {
        if (err) {
            return next(err);
        }
        
        if (user && user.isValidPassword(req.body.password)) {
            res.json(createSessionForUser(user, req.session));
        } else {
            res.status(400).send('Invalid credentials.');
        }
    });
}

/** Gets if the user is currently logged in. */
function isAuthenticated(req, res, next) {
    var sess = req.session;
    if (sess.user && sess.user._id) {
        res.send({ id: sess.user._id, name: sess.user.name, email: sess.user.email });
    } else {
        res.send({ authenticated: false });
    }
}

/** Delete the current session for the currently logged in user. */
function endSession(req, res, next) {
    var sess = req.session;
    if (sess.user && sess.user._id) {
        sess.destroy(function(err) {
            if (err) {
                res.status(500);
                res.send();
            } else {
                res.status(200);
                res.send();
            }
        });
    }
}

var express = require('express');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../users/user-model');
var Micropost = require('../microposts/micropost-model');
var SessionHelper = require('./sessions-helper');
var UserNotFoundException = require('../users/user-not-found-exception');

router.get('/authenticated', isAuthenticated);
router.post('/', authenticateUser);
router.delete('/logout', endSession);

module.exports = router;

/** Authenticates a user. */
function authenticateUser(req, res, next) {
    var sess = req.session;

    User.getUserByEmail(req.body.email).then(function(user) {
        return user.isValidPassword(req.body.password).then(function(isValidPassword) {
            if (isValidPassword) {
                if (user.activated) {
                    sess.user_id = user.id;
                    res.json(user.getObject());
                } else {
                    res.status(403).send('User not yet activated');
                }
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    }).catch(UserNotFoundException, function(message) {
        res.status(401).send('Invalid credentials');
    }).catch(console.log.bind(console));
}

/** Gets if the user is currently logged in. */
function isAuthenticated(req, res, next) {
    var sess = req.session;

    if (sess.user_id) {
        User.getUserById(sess.user_id).then(function(user) {
            res.send(user.getObject());
        }).catch(function() {
            res.send({ authenticated: false });
        });
    } else {
        res.send({ authenticated: false });
    }
}

/** Delete the current session for the currently logged in user. */
function endSession(req, res, next) {
    var sess = req.session;
    if (sess.user_id) {
        sess.destroy(function(err) {
            if (err) {
                res.status(500).send();
            } else {
                SessionHelper.currentUser = null;
                res.status(200).send();
            }
        });
    }
}

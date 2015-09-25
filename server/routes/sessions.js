var express = require('express');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../user/user-model.js');

/** Authenticates a user. */
router.post('/', function(req, res, next) {
    User.findOne({ email: req.body.email }, '_id password', function (err, user) {
        if (err) {
            return next(err);
        }

        if (user && user.isValidPassword(req.body.password)) {
            var sess = req.session;
            sess.user_id = user._id;

            res.json({ id: user._id });
        } else {
            res.json();
        }
    });
});

/** Gets if the user is currently logged in. */
router.get('/authenticated', function(req, res, next) {
    var sess = req.session;
    if (!sess.user_id) {
        res.send({authenticated: false});
    } else {
        res.send({id: sess.user_id});
    }
});

/** Delete the current session for the currently logged in user. */
router.delete('/logout', function(req, res, next) {
    var sess = req.session;
    if (sess.user_id) {
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
});

module.exports = router;

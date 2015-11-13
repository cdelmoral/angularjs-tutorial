var express = require('express');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../user/user-model.js');

/** Authenticates a user. */
router.post('/', function(req, res, next) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            return next(err);
        }

        if (user && user.isValidPassword(req.body.password)) {
            var sess = req.session;
            sess.user = { name: user.name, email: user.email, _id: user._id, admin: user.admin };

            res.json({ name: user.name, email: user.email, id: user._id, admin: user.admin });
        } else {
            res.json();
        }
    });
});

/** Gets if the user is currently logged in. */
router.get('/authenticated', function(req, res, next) {
    var sess = req.session;
    if (sess.user && sess.user._id) {
        res.send({ id: sess.user._id });
    } else {
        res.send({authenticated: false});
    }
});

/** Delete the current session for the currently logged in user. */
router.delete('/logout', function(req, res, next) {
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
});

module.exports = router;

var express = require('express');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../user/user-model.js');

/** Authenticates a user. */
router.post('/', function(req, res, next) {
    User.findOne({ email: req.body.email }, '_id name password', function (err, user) {
        if (err) {
            return next(err);
        }

        if (user && user.isValidPassword(req.body.password)) {
            var sess = req.session;
            sess.user_id = user._id;

            var userToRes = { name: user.name, id: user._id };

            res.json(userToRes);
        } else {
            res.json();
        }
    });
});

module.exports = router;
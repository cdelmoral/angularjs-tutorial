var express = require('express');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../user/user-model.js');
var requireLogin = require('../helpers/sessions-helper.js').requireLogin;

/* Get users listing. */
router.get('/', requireLogin, function(req, res, next) {
    User.find(function (err, users) {
        if (err) {
            return next(err);
        }

        res.json(users);
    });
});

/* Check if the username is not already being used. */
router.get('/valid_name', function(req, res, next) {
    var sess = req.session;
    var query = req.query;

    if (sess.user && sess.user.name === query.name) {
        res.json({ valid: true });
    } else if (query.name) {
        User.count({ name: query.name }, function(err, count) {
            if (err) {
                return next(err);
            }

            res.json({valid: count === 0});
        });
    } else {
        res.json({ valid: false });
    }
});

/* Check if the email is not already being used. */
router.get('/valid_email', function(req, res, next) {
    var sess = req.session;
    var query = req.query;

    if (sess.user && sess.user.email === query.email) {
        res.json({ valid: true });
    } else if (query.email) {
        User.count({ email: query.email }, function(err, count) {
            if (err) {
                return next(err);
            }

            res.json({valid: count === 0});
        });
    } else {
        res.json({ valid: false });
    }
});

/* Get user by id. */
router.get('/:id', requireLogin, function(req, res, next) {
    User.findById(req.params.id, 'name _id email', function (err, user) {
        if (err) {
            return next(err);
        }

        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
});

/** Update user by id. */
router.put('/:id', requireLogin, function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return next(err);
        }

        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save(function(err, user) {
            if (err) {
                return next(err);
            }

            res.json({
                name: user.name,
                email: user.email,
                id: user._id
            });
        })
    })
});

/* Create new user. */
router.post('/', function(req, res, next) {
    var newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    User.create(newUser, function (err, user) {
        if (err) {
            return next(err);
        }

        res.json(user);
    });
});

module.exports = router;

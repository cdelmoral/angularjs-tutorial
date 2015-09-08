var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../user/user-model.js');

/* Get users listing. */
router.get('/', function(req, res, next) {
    User.find(function (err, users) {
        if (err) {
            return next(err);
        }

        res.json(users);
    });
});

/* Check if the username or email is valid. */
router.get('/valid', function(req, res, next) {
    function setValid(err, count) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.json({valid: count === 0});
    }

    if (req.query.name) {
        User.count({name: req.query.name}, setValid);
    } else if (req.query.email) {
        User.count({email: req.query.email}, setValid);
    } else {
        res.json({valid: false});
    }
});

/* Get user by id. */
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return next(err);
        }

        res.json(user);
    });
});

/* Create new user. */
router.post('/', function(req, res, next) {
    var newUser = {
        name: req.body.name,
        email: req.body.email
    };

    User.create(newUser, function (err, user) {
        if (err) {
            return next(err);
        }

        res.json(user);
    });
});

module.exports = router;
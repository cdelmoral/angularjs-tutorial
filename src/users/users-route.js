var express = require('express');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('./user-model');
var requireLogin = require('../sessions/sessions-helper').requireLogin;
var requireCorrectUser = require('../sessions/sessions-helper').requireCorrectUser;
var createSessionForUser = require('../sessions/sessions-helper').createSessionForUser;

router.get('/valid_name', validName);
router.get('/valid_email', validEmail);
router.get('/index_page', requireLogin, getIndexPage);
router.get('/:id', requireLogin, getUserById);
router.get('/activate_user/:id/:token', activateUser)
router.put('/:id', requireCorrectUser, updateUser);
router.post('/', createUser);
router.delete('/:id', requireLogin, deleteUser);

module.exports = router;

/* Check if the username is not already being used. */
function validName(req, res, next) {
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
}

/* Check if the email is not already being used. */
function validEmail(req, res, next) {
    var sess = req.session;
    var query = req.query;

    if (sess.user && sess.user.email === query.email) {
        res.json({ valid: true });
    } else if (query.email) {
        User.count({ email: query.email.toLowerCase() }, function(err, count) {
            if (err) {
                return next(err);
            }

            res.json({valid: count === 0});
        });
    } else {
        res.json({ valid: false });
    }
}

/**
 * Get users page. Expects pageNumber and usersPerPage queries. If they are not present it takes 
 * 1 and 25 respectively as default values.
 */
function getIndexPage(req, res, next) {
    var pageNumber = req.query.pageNumber || 1;
    var usersPerPage = req.query.usersPerPage || 25;
    var skipUsers = (pageNumber - 1) * usersPerPage;
    var params = { limit: usersPerPage, skip: skipUsers };
    User.find({}, '_id name email schema_version', params, function (err, users) {
        if (err) {
            return next(err);
        }

        var retUsers = [];
        for (var i = 0; i < users.length; i++) {
            retUsers.push({
                id: users[i]._id,
                name: users[i].name,
                email: users[i].email
            });
        };

        User.count({}, function (err, count) {
            if (err) {
                return next(err);
            }

            res.json({ count: count, users: retUsers });
        });
    });
}

/** Get user by id. */
function getUserById(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return next(err);
        }

        res.json({
            name: user.name,
            email: user.email,
            id: user._id,
            admin: user.admin
        });
    });
}

/** Activates user. */
function activateUser(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return next(err);
        }

        if (!user.activated && user.isValidActivationToken(req.params.token)) {
            user.activate();
            createSessionForUser(user, req.session)
            res.redirect(200, 'http://localhost:8000/#/users/' + user._id);
        } else {
            res.status(400).send('Invalid activation link.');
        }
    });
}

/** Update user by id. */
function updateUser(req, res, next) {
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
}

/** Delete user by id. */
function deleteUser(req, res, next) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return next(err);
        }

        res.status(200).send('User deleted');
    })
}

/** Create new user. */
function createUser(req, res, next) {
    var newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    User.create(newUser, function (err, user) {
        if (err) {
            return next(err);
        }

        res.json({
            id: user._id
        });
    });
}


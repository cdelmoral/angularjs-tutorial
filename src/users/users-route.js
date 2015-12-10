var express = require('express');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('./user-model');
var Micropost = require('../microposts/micropost-model');
var requireLogin = require('../sessions/sessions-helper').requireLogin;
var requireCorrectUser = require('../sessions/sessions-helper').requireCorrectUser;
var createSessionForUser = require('../sessions/sessions-helper').createSessionForUser;

router.get('/valid_name', validName);
router.get('/valid_email', validEmail);
router.get('/index_page', requireLogin, getIndexPage);
router.get('/:id', requireLogin, getUserById);
router.put('/activate/:id/:token', activateUser);
router.put('/:id', requireCorrectUser, updateUser);
router.put('/new_micropost/:id', requireCorrectUser, createMicropost);
router.post('/', createUser);
router.delete('/:id', requireLogin, deleteUser);

module.exports = router;

/* Check if the username is not already being used. */
function validName(req, res, next) {
    var sess = req.session;
    var name = req.query.name;

    User.isNameAvailable(name, sess.user_id).then(function(available) {
        res.json({ valid: available });
    });
}

/* Check if the email is not already being used. */
function validEmail(req, res, next) {
    var sess = req.session;
    var email = req.query.email;

    User.isEmailAvailable(email, sess.user_id).then(function(available) {
        res.json({ valid: available });
    });
}

/**
 * Get users page. Expects pageNumber and usersPerPage queries. If they are not present it takes 
 * 1 and 25 respectively as default values.
 */
function getIndexPage(req, res, next) {
    var pageNumber = req.query.pageNumber || 1;
    var usersPerPage = req.query.usersPerPage || 25;
    
    User.getUsersPage(pageNumber, usersPerPage)
        .then(function(users) {
            User.getUsersCount()
                .then(function(count) {
                    res.json({ count: count, users: users });
                });
        });
}

/** Get user by id. */
function getUserById(req, res, next) {
    User.getUserById(req.params.id).then(function(user) {
        res.json(user.getObject());
    });
}

/** Activates user. */
function activateUser(req, res, next) {
    User.getUserById(req.params.id).then(function(user) {
        if (!user.activated && user.isValidActivationToken(req.params.token)) {
            user.activate();
            var response = {
                user: createSessionForUser(user, req.session),
                message: 'The account has been activated.'
            }
        } else {
            res.status(400).send('Invalid activation link.');
        }
    });
}

/** Update user by id. */
function updateUser(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    User.updateUserById(req.params.id, name, email, password).then(function(user) {
        res.json({ message: 'User was updated.', user: user.getObject() });
    }).catch(function(err) {
        res.status(500).send(err);
    });
}

/** Delete user by id. */
function deleteUser(req, res, next) {
    User.removeUserById(req.params.id).then(function() {
        res.status(200).send('User was deleted.')
    }).catch(function(err) {
        res.status(500).send(err);
    });
}

/** Create new user. */
function createUser(req, res, next) {
    User.createNewUser(req.body.name, req.body.email, req.body.password)
        .then(function() {
            res.status(200).send('User was created.');
        }).catch(function(err) {
            res.status(500).send(err);
        });
}

function createMicropost(req, res, next) {
    User.getUserById(req.params.id).then(function(user) {
        return user.createMicropost(req.body.content);
    }).then(function(user) {
        res.json(user.getObject());
    }).catch(function(err) {
        console.log(err);
        res.status(500).send(err);
    });
}

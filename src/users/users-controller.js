var User = require('./user-model');
var SessionHelper = require('../sessions/sessions-helper');
var UserNotFoundException = require('./user-not-found-exception');
var UserActivationException = require('./user-activation-exception');

var UsersController = function(){};

/* Check if the username is not already being used. */
UsersController.isUnique = function(req, res, next) {
    var sess = req.session;

    User.isUnique(req.query, sess.user_id).then(function(available) {
        res.json({ valid: available });
    }).catch(console.log.bind(console));
};

/**
 * Get users page. Expects pageNumber and usersPerPage queries. If they are not present it takes 
 * 1 and 25 respectively as default values.
 */
UsersController.getIndexPage = function(req, res, next) {
    var pageNumber = req.query.pageNumber || 1;
    var usersPerPage = req.query.usersPerPage || 25;

    User.getUsersPage(pageNumber, usersPerPage).then(function(users) {
        return User.getUsersCount().then(function(count) {
            res.json({ count: count, users: User.getObjects(users) });
        });
    }).catch(console.log.bind(console));
};

/** Get user by id. */
UsersController.getUserById =function(req, res, next) {
    User.getUserById(req.params.id).then(function(user) {
        res.json(user.getObject());
    }).catch(UserNotFoundException, function(message) {
        res.status(404).send(message.cause);
    }).catch(console.log.bind(console));
};

/** Update user by id. */
UsersController.updateUser = function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    User.updateUserById(req.params.id, name, email, password).then(function(user) {
        res.json({ message: 'User was updated.', user: user.getObject() });
    }).catch(console.log.bind(console));
};

/** Create new user. */
UsersController.createUser = function(req, res, next) {
    User.createNewUser(req.body.name, req.body.email, req.body.password).then(function(message) {
        res.json({
            message: 'Check your email to activate your account before you can log in.'
        });
    }).catch(console.log.bind(console));
};

/** Delete user by id. */
UsersController.deleteUser = function(req, res, next) {
    User.removeUserById(req.params.id).then(function() {
        res.status(200).send('User was deleted.');
    }).catch(console.log.bind(console));
};

/** Activates user. */
UsersController.activateUser = function(req, res, next) {
    User.getUserById(req.params.id).then(function(user) {
        return user.activate(req.params.token).then(function(user) {
            req.session.user_id = user.id;
            res.json({ user: user.getObject(), message: 'The account has been activated.' });
        });
    }).catch(UserActivationException, function(message) {
        res.status(400).send('Invalid activation link.');
    }).catch(console.log.bind(console));
};

UsersController.createMicropost = function(req, res, next) {
    SessionHelper.currentUser.createMicropost(req.body.content).then(function(user) {
        res.json(user.getObject());
    }).catch(console.log.bind(console));
};

UsersController.deleteMicropost = function(req, res, next) {
    SessionHelper.currentUser.deleteMicropostById(req.params.micropost_id).then(function() {
        res.json({ message: 'The micropost was deleted.' });
    }).catch(console.log.bind(console));
};

module.exports = UsersController;

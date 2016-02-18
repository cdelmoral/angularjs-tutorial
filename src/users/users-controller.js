var User = require('./user-model');
var SessionHelper = require('../sessions/sessions-helper');
var UserNotFoundException = require('./user-not-found-exception');
var UserActivationException = require('./user-activation-exception');

var UsersController = function() {};

UsersController.findUser = function(req, res, next, id) {
  return User.getUserById(id).then(function(user) {
    req.user = user;
  }).then(function() {
    next();
    return null;
  }).catch(function() {
    req.user = null;
  });
};

/** Get user by id. */
UsersController.show = function(req, res, next) {
  res.json(req.user.toObject());
};

/* Check if the username is not already being used. */
UsersController.isUnique = function(req, res, next) {
  var sess = req.session;

  return User.isUnique(req.query, sess.user_id).then(function(available) {
    res.json({ valid: available });
  }).catch(console.log.bind(console));
};

/** Get users index page. */
UsersController.index = function(req, res, next) {
  User.getUsersPage(req.query.pageNumber, req.query.usersPerPage).then(function(users) {
    return User.getUsersCount().then(function(count) {
      res.json({ count: count, users: User.getObjects(users) });
    });
  }).catch(console.log.bind(console));
};

/** Update user by id. */
UsersController.update = function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  return req.user.update(name, email, password).then(function(user) {
    res.json({ message: 'User was updated.', user: user.toObject() });
  }).catch(console.log.bind(console));
};

/** Create new user. */
UsersController.createUser = function(req, res, next) {
  return User.createNewUser(req.body.name, req.body.email, req.body.password).then(function(message) {
    res.json({
      message: 'Check your email to activate your account before you can log in.'
    });
  }).catch(console.log.bind(console));
};

/** Delete user by id. */
UsersController.deleteUser = function(req, res, next) {
  return User.removeUserById(req.params.id).then(function() {
    res.status(200).send('User was deleted.');
  }).catch(console.log.bind(console));
};

/** Activates user. */
UsersController.activate = function(req, res, next) {
  req.user.activate(req.params.token).then(function(user) {
    req.session.user_id = user.id;
    res.json({ user: user.toObject(), message: 'The account has been activated.' });
  }).catch(UserActivationException, function(message) {
    res.status(400).send('Invalid activation link.');
  }).catch(console.log.bind(console));
};

UsersController.createMicropost = function(req, res, next) {
  return req.user.createMicropost(req.body.content).then(function(user) {
    res.json(user.toObject());
  }).catch(console.log.bind(console));
};

UsersController.deleteMicropost = function(req, res, next) {
  return SessionHelper.currentUser.deleteMicropostById(req.params.micropost_id).then(function() {
    res.json({ message: 'The micropost was deleted.' });
  }).catch(console.log.bind(console));
};

module.exports = UsersController;

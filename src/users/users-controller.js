var User = require('./user-model');
var SessionHelper = require('../sessions/sessions-helper');
var InvalidActivationLinkError = require('./invalid-activation-link-error');

var UsersController = function() {};

UsersController.find = function(req, res, next, id) {
  User.findByIdAsync(id).then(function(user) {
    req.user = user;
    next();
    return null;
  }).catch(console.log.bind(console));
};

/** Get user by id. */
UsersController.show = function(req, res, next) {
  res.json(req.user.toObject());
};

/** Get users index page. */
UsersController.index = function(req, res, next) {
  var skipUsers = (req.query.pageNumber - 1) * req.query.usersPerPage;
  var sort = { created_at: 1 };
  var params = { limit: req.query.usersPerPage, skip: skipUsers, sort: sort };

  var usersPromise = User.findAsync({}, null, params).then(function(users) {
    var objects = [];
    for (var i = 0; i < users.length; i++) {
      objects.push(users[i].toObject());
    }
    return objects;
  });

  Promise.all([usersPromise, User.countAsync({})]).then(function(results) {
    res.json({ count: results[1], users: results[0] });
  }).catch(console.log.bind(console));
};

/** Update name, email and password for user. */
UsersController.update = function(req, res, next) {
  req.user.name = req.body.name;
  req.user.email = req.body.email;
  req.user.password = req.body.password;
  Promise.resolve().then(function(){
    req.user.save(function(err, user) {
      res.json({ message: 'User was update.', user: user.toObject() });
    });
  }).catch(console.log.bind(console));
};

/** Create new user. */
UsersController.create = function(req, res, next) {
  User.createAsync({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }).then(function() {
    res.json({ message: 'Check your email to activate your account before you can log in.' });
  }).catch(console.log.bind(console));
};

/* Check if the username is not already being used. */
UsersController.unique = function(req, res, next) {
  User.findOneAsync(req.query).then(function(user) {
    res.json({ valid: user === null || req.currentUser && user.equals(req.currentUser) });
  }).catch(console.log.bind(console));
};

/** Delete user by id. */
UsersController.destroy = function(req, res, next) {
  req.user.remove().then(function(user) {
    res.status(200).send('User was deleted.');
  }).catch(console.log.bind(console));
};

/** Activates a user. */
UsersController.activate = function(req, res, next) {
  Promise.resolve().then(function() {
    return req.user && !req.user.activated &&
           req.user.authenticated(req.params.token, 'activation_digest');
  }).then(function(valid) {
    if (valid) {
      return req.user.activate();
    } else {
      throw new InvalidActivationLinkError('Invalid activation link.');
    }
  }).then(function(user) {
    req.session.user_id = user.id;
    res.json({ user: user.toObject(), message: 'The account has been activated.' });
  }).catch(InvalidActivationLinkError, function(err) {
    res.status(400).send(err.message);
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

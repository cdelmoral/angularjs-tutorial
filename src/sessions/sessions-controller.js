var User = require('../users/user-model');
var SessionHelper = require('./sessions-helper');
var UserNotFoundException = require('../users/user-not-found-exception');
var UserActivationException = require('../users/user-activation-exception');
var UserCredentialsException = require('../users/user-credentials-exception');

var SessionsController = function(){};

SessionsController.findUserSession = function(req, res, next) {
  User.findByIdAsync(req.session.user_id).then(function(user) {
    req.currentUser = user;
    next();
    return null;
  }).catch(console.log.bind(console));
};

/** Authenticates a user. */
SessionsController.create = function(req, res, next) {
  User.findOneAsync({ email: req.body.email.toLowerCase() }).then(function(user) {
    req.user = user;
    return user && user.authenticate(req.body.password);
  }).then(function(valid) {
    if (valid && req.user.activated) {
      SessionHelper.createSessionsForUser(req.user, req);
      res.json(req.user.toObject());
    } else if (valid) {
      res.status(401).send('User not yet activated');
    } else {
      res.status(401).send('Invalid credentials');
    }
  }).catch(console.log.bind(console));
};

/** Gets if the user is currently logged in. */
SessionsController.isAuthenticated = function(req, res, next) {
  return User.getUserById(req.session.user_id).then(function(user) {
    res.send(user.toObject());
    return null;
  }).catch(UserNotFoundException, function(message) {
    res.send({ authenticated: false });
    return null;
  }).catch(console.log.bind(console));
};

/** Delete the current session for the currently logged in user. */
SessionsController.endSession = function(req, res, next) {
  return SessionHelper.destroySession(req).then(function() {
    res.status(200).send();
  }).catch(function(message) {
    res.status(500).send();
  });
};

module.exports = SessionsController;

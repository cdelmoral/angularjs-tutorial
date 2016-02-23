var User = require('../users/user-model');
var SessionHelper = require('./sessions-helper');

var SessionsController = function(){};

SessionsController.find = function(req, res, next) {
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
    return user && user.authenticated(req.body.password, 'password');
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
SessionsController.authenticated = function(req, res, next) {
  User.findByIdAsync(req.session.user_id).then(function(user) {
    if (user) {
      res.send(user.toObject());
    } else {
      res.send({ authenticated: false });
    }
  }).catch(console.log.bind(console));
};

/** Delete the current session for the currently logged in user. */
SessionsController.destroy = function(req, res, next) {
  return SessionHelper.destroySession(req).then(function() {
    res.status(200).send();
  }).catch(function(message) {
    res.status(500).send();
  });
};

module.exports = SessionsController;

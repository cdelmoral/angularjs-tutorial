var Promise = require('bluebird');

var SessionHelper = function() {};

SessionHelper.requireLogin = function(req, res, next) {
  if (req.currentUser) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

SessionHelper.requireCorrectUser = function(req, res, next) {
  SessionHelper.requireLogin(req, res, function() {
    if (req.user.id === req.currentUser.id) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

SessionHelper.createSessionsForUser = function(user, req) {
  req.currentUser = user;
  req.session.user_id = user.id;
};

SessionHelper.destroySession = function(req) {
  return Promise.promisifyAll(req.session).destroyAsync().then(function() {
    req.currentUser = null;
  });
};

module.exports = SessionHelper;

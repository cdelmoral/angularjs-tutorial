var Promise = require('bluebird');

var SessionHelper = function() {};

SessionHelper.loggedIn = function(req, res, next) {
  if (req.currentUser) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

SessionHelper.correctUser = function(req, res, next) {
  SessionHelper.loggedIn(req, res, function() {
    if (req.user.id === req.currentUser.id) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

SessionHelper.login = function(req, user) {
  req.currentUser = user;
  req.session.user_id = user.id;
};

SessionHelper.logout = function(req) {
  return Promise.promisifyAll(req.session).destroyAsync().then(function() {
    req.currentUser = null;
    return;
  });
};

module.exports = SessionHelper;

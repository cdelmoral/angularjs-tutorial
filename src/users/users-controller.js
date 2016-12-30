var User = require('./user-model');
var Relationship = require('./relationship-model');
var Logger = require('../logger/logger');
var SessionHelper = require('../sessions/sessions-helper');
var InvalidActivationLinkError = require('./invalid-activation-link-error');

var UsersController = function() {};

UsersController.find = function(req, res, next, id) {
  User.findByIdAsync(id).then(function(user) {
    req.user = user;
    next();
    return null;
  }).catch(Logger.logError);
};

/** Get user by id. */
UsersController.show = function(req, res, next) {
  res.json(req.user.toObject());
};

/** Get users index page. */
UsersController.index = function(req, res, next) {
  var skipUsers = (req.query.pageNumber - 1) * req.query.usersPerPage;
  var sort = { created_at: 1 };
  var params = { limit: parseInt(req.query.usersPerPage), skip: skipUsers, sort: sort };

  var usersPromise = User.findAsync({}, null, params).then(function(users) {
    return users.map(userToObject);
  });

  Promise.all([usersPromise, User.countAsync({})]).then(function(results) {
    res.json({ count: results[1], users: results[0] });
  }).catch(Logger.logError);
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
  }).catch(Logger.logError);
};

UsersController.isFollowing = function(req, res, next) {
  User.findByIdAsync(req.params.following_id).then(function(user) {
    return user !== null && req.user.isFollowing(user);
  }).then(function(isFollowing) {
    res.json({ is_following: isFollowing });
  }).catch(Logger.logError);
}

/** Create new user. */
UsersController.create = function(req, res, next) {
  User.createAsync({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }).then(function() {
    res.json({ message: 'Check your email to activate your account before you can log in.' });
  }).catch(Logger.logError);
};

/* Check if the username is not already being used. */
UsersController.unique = function(req, res, next) {
  User.findOneAsync(req.query).then(function(user) {
    res.json({ valid: user === null || req.currentUser && user.equals(req.currentUser) });
  }).catch(Logger.logError);
};

/** Delete user by id. */
UsersController.destroy = function(req, res, next) {
  req.user.remove().then(function(user) {
    res.status(200).send('User was deleted.');
  }).catch(Logger.logError);
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
  }).catch(Logger.logError);
};

/** Get following index page. */
UsersController.following = function(req, res, next) {
  var skip = (req.query.page - 1) * req.query.limit;
  var sort = { created_at: 1 };
  var params = { limit: req.query.limit, skip: skip, sort: sort };
  var filter = { follower_id: req.user._id };

  var query = Relationship.find(filter, null, params).populate('followed_id');
  var following = query.exec().then(function(rels) {
    return rels.map(pluckFollowed);
  });

  Promise.all([following, Relationship.count(filter)]).then(function(results) {
    res.json({ count: results[1], following: results[0] });
  }).catch(Logger.logError);
};

UsersController.allFollowers = function(req, res, next) {
  var filter = {followed_id: req.user._id};
  var query = Relationship.find(filter).populate('follower_id', 'name gravatar_id');
  var followers = query.exec().then(function(rels) {
    return res.json({followers: rels.map(pluckFollower)});
  });
};

UsersController.allFollowing = function(req, res, next) {
  var filter = {follower_id: req.user._id};
  var query = Relationship.find(filter).populate('followed_id', 'name gravatar_id');
  var following = query.exec().then(function(rels) {
    return res.json({following: rels.map(pluckFollowed)});
  });
};

/** Get followers index page. */
UsersController.followers = function(req, res, next) {
  var skip = (req.query.page - 1) * req.query.limit;
  var sort = { created_at: 1 };
  var params = { limit: req.query.limit, skip: skip, sort: sort };
  var filter = { followed_id: req.user._id };

  var query = Relationship.find(filter, null, params).populate('follower_id');
  var followers = query.exec().then(function(rels) {
    return rels.map(pluckFollower);
  });

  Promise.all([followers, Relationship.count(filter)]).then(function(results) {
    res.json({ count: results[1], followers: results[0] });
  }).catch(Logger.logError);
};

module.exports = UsersController;

function userToObject(user) {
  return user.toObject();
}

function pluckFollowed(relationship) {
  return relationship.followed_id.toObject();
}

function pluckFollower(relationship) {
  return relationship.follower_id.toObject();
}

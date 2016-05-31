var Logger = require('../logger/logger');

var RelationshipsController = function() {};

RelationshipsController.create = function(req, res, next) {
  req.currentUser.follow(req.user).then(function() {
    res.status(200).send();
  });
};

RelationshipsController.destroy = function(req, res, next) {
  req.currentUser.unfollow(req.user).then(function() {
    res.status(200).send();
  });
};

module.exports = RelationshipsController;

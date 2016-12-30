var Micropost = require('./micropost-model');
var Relationship = require('../users/relationship-model');
var User = require('../users/user-model');
var Logger = require('../logger/logger');

var MicropostsController = function() {};

MicropostsController.find = function(req, res, next, id) {
  Micropost.findByIdAsync(id).then(function(micropost) {
    req.micropost = micropost;
    next();
    return;
  }).catch(Logger.logError);
};

MicropostsController.create = function(req, res, next) {
  Micropost.createAsync({ user_id: req.user._id, content: req.body.content }).then(function(micropost) {
    req.user.microposts_count++;
    return req.user.save();
  }).then(function(user) {
    res.json(user.toObject());
  }).catch(Logger.logError);
};

MicropostsController.destroy = function(req, res, next) {
  req.micropost.remove().then(function(micropost) {
    req.user.microposts_count--;
    return req.user.save();
  }).then(function(user) {
    res.status(200).send('Micropost was deleted.');
  }).catch(Logger.logError);
};

MicropostsController.feed = function(req, res, next) {
  var skip = (req.query.pageNumber - 1) * req.query.itemsPerPage;
  var sort = {created_at: -1};
  var params = {limit: parseInt(req.query.itemsPerPage), skip: skip, sort: sort};

  Relationship.findAsync({follower_id: req.params.user_id}).then(function(rels) {
    var userIds = rels.map(function(rel) {
      return rel.followed_id;
    });

    var microposts = Micropost.find({user_id: {$in: userIds}}, null, params)
      .populate({path: 'user_id', select: 'name gravatar_id'}).exec().then(function(microposts) {
        return microposts.map(function(micropost) {
          return micropost.toObject();
        });
      });

    var count = Micropost.countAsync({user_id: {$in: userIds}});

    Promise.all([microposts, count]).then(function(results) {
      res.json({ count: results[1], microposts: results[0] });
    }).catch(Logger.logError);
  });
}

MicropostsController.index = function(req, res, next) {
  var skip = (req.query.pageNumber - 1) * req.query.itemsPerPage;
  var sort = { created_at: -1 };
  var params = { limit: parseInt(req.query.itemsPerPage), skip: skip, sort: sort };

  var micropostsPromise = Micropost.find({ user_id: req.user._id }, null, params)
    .populate({path: 'user_id', select: 'name gravatar_id'}).exec().then(function(microposts) {
      return microposts.map(function(micropost) {
        return micropost.toObject();
      });
    });

  var countPromise = Micropost.countAsync({ user_id: req.user._id });

  Promise.all([micropostsPromise, countPromise]).then(function(results) {
    res.json({ count: results[1], microposts: results[0] });
  }).catch(Logger.logError);
};

MicropostsController.count = function(req, res, next) {
  Micropost.countAsync({ user_id: req.user._id }).then(function(count) {
    res.json({ count: count });
  }).catch(Logger.logError);
};

module.exports = MicropostsController;

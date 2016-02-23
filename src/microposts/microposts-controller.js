var Micropost = require('./micropost-model');

var MicropostsController = function() {};

MicropostsController.find = function(req, res, next, id) {
  Micropost.findByIdAsync(id).then(function(micropost) {
    req.micropost = micropost;
    next();
    return;
  }).catch(console.log.bind(console));
};

MicropostsController.create = function(req, res, next) {
  Micropost.createAsync({ user_id: req.user._id, content: req.body.content }).then(function(micropost) {
    req.user.microposts_count++;
    return req.user.save();
  }).then(function(user) {
    res.json(user.toObject());
  }).catch(console.log.bind(console));
};

MicropostsController.destroy = function(req, res, next) {
  req.micropost.remove().then(function(micropost) {
    req.user.microposts_count--;
    return req.user.save();
  }).then(function(user) {
    res.status(200).send('Micropost was deleted.');
  }).catch(console.log.bind(console));
};

MicropostsController.getMicropostPageForUser = function(req, res, next) {
  var userId = req.params.user_id;
  var pageNumber = req.query.pageNumber || 1;
  var itemsPerPage = req.query.itemsPerPage || 25;
  return Micropost.getMicropostsPageForUser(userId, pageNumber, itemsPerPage).then(function(microposts) {
    return Micropost.getMicropostsCountForUser(userId).then(function(count) {
      res.json({ count: count, microposts: Micropost.getObjects(microposts) });
    });
  }).catch(console.log.bind(console));
};

MicropostsController.getMicropostFeedPageForUser = function(req, res, next) {
  var userId = req.params.user_id;
  var pageNumber = req.query.pageNumber || 1;
  var itemsPerPage = req.query.itemsPerPage || 25;
  return Micropost.getMicropostFeedPageForUser(userId, pageNumber, itemsPerPage).then(function(microposts) {
    return Micropost.getMicropostFeedCountForUser(userId).then(function(count) {
      res.json({ count: count, microposts: microposts });
    });
  }).catch(console.log.bind(console));
};

MicropostsController.getMicropostCountForUser = function(req, res, next) {
  return Micropost.getMicropostsCountForUser(req.params.user_id).then(function(count) {
    res.json({ count: count });
  }).catch(console.log.bind(console));
};

module.exports = MicropostsController;

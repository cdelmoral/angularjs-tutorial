var Micropost = require('./micropost-model');

var MicropostsController = function(){};

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

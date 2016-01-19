var Promise = require('bluebird');
var mongoose = require('mongoose');

var micropostSchema = require('./micropost-schema');
var handleError = require('../common/error-handling').handleError;

micropostSchema.statics.getMicropostsPageForUser = function(userId, pageNumber, micropostsPerPage) {
    var skipMicroposts = (pageNumber - 1) * micropostsPerPage;
    var sort = { created_at: -1 };
    var params = { limit: micropostsPerPage, skip: skipMicroposts, sort: sort };
    return Micropost.findAsync({ user_id: userId }, null, params);
};

micropostSchema.statics.getMicropostFeedPageForUser = function(userId, pageNumber, itemsPerPage) {
    var skipItems = (pageNumber - 1) * itemsPerPage;
    var sort = { created_at: -1 };
    var params = { limit: itemsPerPage, skip: skipItems, sort: sort };
    return Micropost.findAsync({ user_id: userId }, null, params);
};

micropostSchema.statics.getMicropostsCountForUser = function(userId) {
    return Micropost.countAsync({ user_id: userId });
};

micropostSchema.statics.getMicropostFeedCountForUser = function(userId) {
    return Micropost.count({ user_id: userId });
};

micropostSchema.statics.getObjects = function(microposts) {
    var objects = [];

    for (var i = 0; i < microposts.length; i++) {
        objects.push(microposts[i].getObject());
    }

    return objects;
};

micropostSchema.methods.getObject = function() {
    var micropost = this;
    var object = micropost.toJSON({ versionKey: false });

    object.id = object._id;
    delete object._id;
    delete object.schema_version;

    return object;
};

var Micropost = Promise.promisifyAll(mongoose.model('Micropost', micropostSchema));

module.exports = Micropost;

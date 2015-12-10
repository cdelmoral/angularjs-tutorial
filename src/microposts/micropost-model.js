var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validate = require('../common/validator');
var handleError = require('../common/error-handling').handleError;
var upgradeSchema = require('./micropost-migrations').upgradeSchema;
var downgradeSchema = require('./micropost-migrations').downgradeSchema;
var currentSchemaVersion = require('./micropost-migrations').currentSchemaVersion;

var micropostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        validate: [
            validate({ validator: 'isNotWhiteSpace'}),
            validate({ validator: 'isLength', arguments: [0, 140]})
        ]
    },
    user_id: { type: Schema.ObjectId, required: true, index: true },
    created_at: { type: Date, default: Date.now(), index: true },
    updated_at: { type: Date, default: Date.now() },
});

micropostSchema.post('init', handleMigrations);
micropostSchema.statics.getMicropostsPageForUser = getMicropostsPageForUser;
micropostSchema.statics.getMicropostsCountForUser = getMicropostsCountForUser;

var Micropost = mongoose.model('Micropost', micropostSchema);

module.exports = Micropost;

function handleMigrations(micropost) {
    if (!micropost.schema_version) {
        micropost.schema_version = 0;
    }

    if (micropost.schema_version < currentSchemaVersion) {
        upgradeSchema(micropost);
    } else if (micropost.schema_version > currentSchemaVersion) {
        downgradeSchema(micropost);
    }
}

function getMicropostsPageForUser(userId, pageNumber, micropostsPerPage) {
    var skipMicroposts = (pageNumber - 1) * micropostsPerPage;
    var sort = { created_at: -1 };
    var params = { limit: micropostsPerPage, skip: skipMicroposts, sort: sort };

    var promise = new Promise(function(resolve, reject) {
        Micropost.find({ user_id: userId }, null, params, function(err, microposts) {
            handleError(reject, err);

            var retMicroposts = [];
            for (var i = 0; i < microposts.length; i++) {
                var micropost = microposts[i];

                retMicroposts.push({
                    content: micropost.content,
                    created_at: micropost.created_at
                });
            };

            resolve(retMicroposts);
        });
    });

    return promise;
}

function getMicropostsCountForUser(userId) {
    var promise = new Promise(function(resolve, reject) {
        Micropost.count({ user_id: userId }, function(err, count) {
            handleError(reject, err);

            resolve(count);
        });
    });

    return promise;
}
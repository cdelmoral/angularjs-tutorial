var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var validate = require('../common/validator');
var currentSchemaVersion = require('./micropost-migrations').currentSchemaVersion;
var handleMigrations = require('./micropost-migrations').handleMigrations;

var micropostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        validate: [
            validate({ validator: 'isNotWhiteSpace'}),
            validate({ validator: 'isLength', arguments: [0, 140]})
        ]
    },
    user_id: { type: ObjectId, required: true, index: true },
    created_at: { type: Date, index: true },
    updated_at: { type: Date },
});

micropostSchema.post('init', handleMigrations);
micropostSchema.pre('save', initialize);

module.exports = micropostSchema;

function initialize(next) {
    var micropost = this;

    if (micropost.created_at === undefined) {
        var now = Date.now();

        micropost.created_at = now;
        micropost.updated_at = now;
    }

    next();
}

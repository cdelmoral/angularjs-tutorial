var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var validate = require('../common/validator');
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
    user_id: { type: ObjectId, required: true, index: true },
    created_at: { type: Date, default: Date.now(), index: true },
    updated_at: { type: Date, default: Date.now() },
});

module.exports = micropostSchema;

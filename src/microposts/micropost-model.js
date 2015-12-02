var mongoose = require('mongoose');

var validate = require('../common/validator');
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
    user_id: { type: ObjectId, required: true, index: true },
    created_at: { type: Date, default: Date.now(), index: true },
    updated_at: { type: Date, default: Date.now() },
});

micropostSchema.post('init', handleMigrations);

module.exports = mongoose.model('User', micropostSchema);

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

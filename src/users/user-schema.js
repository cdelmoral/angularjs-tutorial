var mongoose = require('mongoose');

var validate = require('../common/validator');
var currentSchemaVersion = require('./user-migrations').currentSchemaVersion;

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [
            validate({ validator: 'isNotWhiteSpace'}),
            validate({ validator: 'isLength', arguments: [0, 50]})
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            validate({ validator: 'isNotWhiteSpace' }),
            validate({ validator: 'isLength', arguments: [0, 255]}),
            validate({ validator: 'isEmail' })
        ]
    },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    schema_version: { type: Number, default: currentSchemaVersion },
    activation_digest: { type: String },
    activated: { type: Boolean, default: false },
    activated_at: { type: Date },
    reset_digest: { type: String },
    reset_sent_at: { type: Date },
    reset_password_at: { type: Date },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
    microposts_count: { type: Number, default: 0 }
});

module.exports = userSchema;

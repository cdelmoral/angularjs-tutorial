var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var validate = require('../common/validator');
var handleMigrations = require('./relationship-migrations').handleMigrations;
var currentSchemaVersion = require('./relationship-migrations').currentSchemaVersion;

var relationshipSchema = new mongoose.Schema({
  follower_id: { type: ObjectId, ref: 'User', required: true, index: true},
  followed_id: { type: ObjectId, ref: 'User', required: true, index: true},
  schema_version: { type: Number, default: currentSchemaVersion },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() }
});

relationshipSchema.index({ follower_id: 1, followed_id: 1 }, { unique: true });

relationshipSchema.post('init', handleMigrations);

relationshipSchema.options.toObject = {
  transform: function(doc, ret, options) {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;
    delete ret.schema_version;
  }
};

module.exports = relationshipSchema;

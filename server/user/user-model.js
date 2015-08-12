var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: String,
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('User', UserSchema);
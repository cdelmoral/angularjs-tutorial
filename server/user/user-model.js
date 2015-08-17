var mongoose = require('mongoose');
var validate = require('../common/validator');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true ,
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
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('User', UserSchema);
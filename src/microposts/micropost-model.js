var Promise = require('bluebird');
var mongoose = require('mongoose');

var micropostSchema = require('./micropost-schema');

var Micropost = Promise.promisifyAll(mongoose.model('Micropost', micropostSchema));

module.exports = Micropost;

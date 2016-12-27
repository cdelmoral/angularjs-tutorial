var Promise = require('bluebird');
var mongoose = require('mongoose');

var RelationshipSchema = require('./relationship-schema');
var Logger = require('../logger/logger');

var Relationship = Promise.promisifyAll(mongoose.model('Relationship', RelationshipSchema));

module.exports = Relationship;

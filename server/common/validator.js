var validate = require('mongoose-validator');

validate.extend('isNotWhiteSpace', function (input) {
  return !(/^\s+$/.test(input));
}, 'String should not be empty.');

module.exports = validate;
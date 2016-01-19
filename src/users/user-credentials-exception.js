var OperationalError = require('bluebird').OperationalError;

function UserCredentialsException(message) {
	OperationalError.call(this, message);
}

UserCredentialsException.prototype = Object.create(OperationalError.prototype);
UserCredentialsException.prototype.constructor = UserCredentialsException;

module.exports = UserCredentialsException;

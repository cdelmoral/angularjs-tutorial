var OperationalError = require('bluebird').OperationalError;

function UserPasswordResetException(message) {
	OperationalError.call(this, message);
}

UserPasswordResetException.prototype = Object.create(OperationalError.prototype);
UserPasswordResetException.prototype.constructor = UserPasswordResetException;

module.exports = UserPasswordResetException;

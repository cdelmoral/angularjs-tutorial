var OperationalError = require('bluebird').OperationalError;

function UserActivationException(message) {
	OperationalError.call(this, message);
}

UserActivationException.prototype = Object.create(OperationalError.prototype);
UserActivationException.prototype.constructor = UserActivationException;

module.exports = UserActivationException;

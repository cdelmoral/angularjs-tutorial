var OperationalError = require('bluebird').OperationalError;

function UserNotFoundException(message) {
	OperationalError.call(this, message);
}

UserNotFoundException.prototype = Object.create(OperationalError.prototype);
UserNotFoundException.prototype.constructor = UserNotFoundException;

module.exports = UserNotFoundException;

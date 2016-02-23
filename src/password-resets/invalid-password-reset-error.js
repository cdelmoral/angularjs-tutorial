var OperationalError = require('bluebird').OperationalError;

function InvalidPasswordResetLinkError(message) {
	OperationalError.call(this, message);
}

InvalidPasswordResetLinkError.prototype = Object.create(OperationalError.prototype);
InvalidPasswordResetLinkError.prototype.constructor = InvalidPasswordResetLinkError;

module.exports = InvalidPasswordResetLinkError;

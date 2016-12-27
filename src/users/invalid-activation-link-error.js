var OperationalError = require('bluebird').OperationalError;

function InvalidActivationLinkError(message) {
	OperationalError.call(this, message);
}

InvalidActivationLinkError.prototype = Object.create(OperationalError.prototype);
InvalidActivationLinkError.prototype.constructor = InvalidActivationLinkError;

module.exports = InvalidActivationLinkError;

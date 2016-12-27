var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({timestamp: true})
  ]
});

var Logger = function() {};

Logger.logError = function(err) {
  logger.error(err);
};

module.exports = Logger;

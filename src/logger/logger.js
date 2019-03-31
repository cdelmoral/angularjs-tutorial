var winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ timestamp: true })
  ]
});

var Logger = function() {};

Logger.logError = function(err) {
  logger.error(err);
};

module.exports = Logger;

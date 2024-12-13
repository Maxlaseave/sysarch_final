const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log the request
  logger.info(`${req.method} ${req.url} - Started`);

  // Override the end function to log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = { requestLogger };

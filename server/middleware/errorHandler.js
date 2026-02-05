const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error encountered on [${req.method} ${req.url}]: ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    traceId: req.headers['x-request-id'] || 'trace-' + Date.now(),
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;

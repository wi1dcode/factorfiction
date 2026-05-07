const logger = require('../utils/logger')

// Express global error handler
function errorHandler(err, req, res, next) {
  logger.error(err.message, err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code:  err.code    || 'INTERNAL_ERROR',
  })
}

// 404 handler
function notFound(req, res) {
  res.status(404).json({ error: 'Route not found', code: 'NOT_FOUND' })
}

module.exports = { errorHandler, notFound }

/**
 * HTTP Request Logging Middleware
 * Phase 2 Week 5: Structured Logging
 *
 * Logs all HTTP requests with:
 * - Request correlation IDs
 * - Response times
 * - Status codes
 * - User information (if authenticated)
 * - Request metadata
 */

const logger = require('../utils/logger')
const {v4: uuidv4} = require('uuid')

/**
 * Generate or extract correlation ID from request
 */
function getCorrelationId(req) {
  // Check if correlation ID is provided by client
  return req.headers['x-correlation-id'] ||
         req.headers['x-request-id'] ||
         uuidv4()
}

/**
 * HTTP request logging middleware
 */
function requestLogger(req, res, next) {
  const startTime = Date.now()

  // Generate correlation ID
  const correlationId = getCorrelationId(req)
  req.correlationId = correlationId

  // Add correlation ID to response headers
  res.setHeader('X-Correlation-ID', correlationId)

  // Create request-specific logger
  req.logger = logger.withCorrelation(correlationId)

  // Skip logging for health check and static assets
  const skipPaths = ['/api/health', '/favicon.ico', '/static/']
  const shouldSkip = skipPaths.some(path => req.path.startsWith(path))

  if (shouldSkip) {
    return next()
  }

  // Log request
  const requestMeta = {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    correlationId
  }

  logger.http('Incoming request', requestMeta)

  // Capture response
  const originalSend = res.send

  res.send = function (data) {
    res.send = originalSend // Restore original send
    const responseTime = Date.now() - startTime

    // Log response
    const responseMeta = {
      ...requestMeta,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userId: req.user?.id || null,
      companyId: req.user?.company || null
    }

    // Use appropriate log level based on status code
    if (res.statusCode >= 500) {
      logger.error('Request completed with error', responseMeta)
    } else if (res.statusCode >= 400) {
      logger.warn('Request completed with client error', responseMeta)
    } else {
      logger.http('Request completed', responseMeta)
    }

    return originalSend.call(this, data)
  }

  next()
}

/**
 * Error logging middleware
 * Should be added after all routes
 */
function errorLogger(err, req, res, next) {
  const correlationId = req.correlationId || 'unknown'

  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip,
    userId: req.user?.id || null,
    companyId: req.user?.company || null,
    correlationId
  })

  next(err)
}

module.exports = {
  requestLogger,
  errorLogger
}

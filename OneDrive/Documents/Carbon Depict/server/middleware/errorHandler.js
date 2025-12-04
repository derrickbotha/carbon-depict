/**
 * Error Handling Middleware - Phase 3 Week 13
 *
 * Centralized error handling with:
 * - Custom error classes
 * - Structured error responses
 * - Error logging
 * - Environment-specific error details
 */
const logger = require('../utils/logger')

/**
 * Custom error classes
 */
class AppError extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = true
    this.timestamp = new Date().toISOString()

    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR')
    this.name = 'NotFoundError'
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT_ERROR')
    this.name = 'ConflictError'
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR')
    this.name = 'RateLimitError'
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details = null) {
    super(message, 500, 'DATABASE_ERROR', details)
    this.name = 'DatabaseError'
  }
}

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Set defaults
  let error = { ...err }
  error.message = err.message
  error.statusCode = err.statusCode || 500
  error.code = err.code || 'INTERNAL_SERVER_ERROR'

  // Log error
  logError(err, req)

  // Handle specific error types
  if (err.name === 'CastError') {
    error = new ValidationError(`Invalid ${err.path}: ${err.value}`)
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }))
    error = new ValidationError('Validation failed', details)
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    error = new ConflictError(`${field} already exists`)
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token')
  }

  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired')
  }

  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    error = new DatabaseError(err.message)
  }

  // Build error response
  const response = {
    success: false,
    error: error.message,
    code: error.code,
    ...(error.details && { details: error.details })
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
    response.originalError = err
  }

  // Send response
  res.status(error.statusCode).json(response)
}

/**
 * Log error
 */
const logError = (err, req) => {
  const errorLog = {
    message: err.message,
    statusCode: err.statusCode,
    code: err.code,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent')
    },
    user: req.user ? {
      id: req.user._id,
      email: req.user.email
    } : null
  }

  // Log based on severity
  if (err.statusCode >= 500) {
    logger.error('Server Error:', errorLog)
  } else if (err.statusCode >= 400) {
    logger.warn('Client Error:', errorLog)
  } else {
    logger.info('Error:', errorLog)
  }
}

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Not found handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl}`)
  next(error)
}

/**
 * Validation error formatter
 */
const formatValidationErrors = (errors) => {
  return errors.array().map(error => ({
    field: error.param,
    message: error.msg,
    value: error.value
  }))
}

/**
 * Safe JSON parse with error handling
 */
const safeJSONParse = (data, defaultValue = null) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    logger.error('JSON parse error:', error)
    return defaultValue
  }
}

/**
 * Error reporter (for external services like Sentry)
 */
const reportError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'production') {
    // Integrate with error tracking service
    // Example: Sentry.captureException(error, { extra: context })
    logger.error('Error reported:', { error, context })
  }
}

module.exports = {
  // Error classes
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,

  // Middleware
  errorHandler,
  asyncHandler,
  notFoundHandler,

  // Utilities
  logError,
  formatValidationErrors,
  safeJSONParse,
  reportError
}
